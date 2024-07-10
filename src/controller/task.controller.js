import User from "../model/UserInfo.js";
import Task from "../model/Task.js";
import dotenv from "dotenv";

// const { TwitterApi } = require('twitter-api-v2');
import bs58 from "bs58";

import Telegram from "node-telegram-bot-api";

dotenv.config();
const bot = new Telegram(process.env.TGTOKEN); // Ensure BOT_TOKEN is set in your environment variables
const chatId = process.env.CHAT_ID;
// const { TWITTER_API_KEY, TWITTER_API_SECRET_KEY, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_TOKEN_SECRET } = process.env;

// Initialize Twitter client
// const twitterClient = new TwitterApi({
// 	appKey: TWITTER_API_KEY,
// 	appSecret: TWITTER_API_SECRET_KEY,
// 	accessToken: TWITTER_ACCESS_TOKEN,
// 	accessSecret: TWITTER_ACCESS_TOKEN_SECRET,
// });

const QuestType = {
  FOLLOW_X: "FOLLOW_X",
  MINT_COIN: "MINT_COIN",
  JOIN_TELEGRAM: "JOIN_TELEGRAM",
  JOIN_DISCORD: "JOIN_DISCORD",
  VISIT_WEBSITE: "VISIT_WEBSITE",
  SHARE_WALLET: "SHARE_WALLET",
  SHARE_EMAIL: "SHARE_EMAIL",
  RETWEET_X_POST: "RETWEET_X_POST",
  COMING_SOON: "COMING_SOON",
};

const rewardsConfig = [
  {
    icon: "/image/icon/icon_twitter.svg",
    link: "https://x.com/gorwachain",
    description: "Follow our X account",
    prize: 125,
    type: QuestType.FOLLOW_X,
    completed: false,
    account: "crozoasdf",
  },
  {
    icon: "/image/icon/icon_mint.svg",
    link: "/",
    description: "Mint $XATOM",
    prize: 1000,
    type: QuestType.MINT_COIN,
    completed: false,
  },
  {
    icon: "/image/icon/icon_telegram.svg",
    link: "https://t.me/gorwachain",
    description: "Join our Telegram",
    prize: 125,
    type: QuestType.JOIN_TELEGRAM,
    completed: false,
  },
  // {
  // 	icon: '/image/icon/icon_discord.svg',
  // 	link: 'https://discord.gg/gorwachain',
  // 	description: 'Join our Discord',
  // 	prize: 125,
  // 	type: QuestType.JOIN_DISCORD,
  // },
  {
    icon: "/image/icon/icon_ether.svg",
    description: "Share your BTC wallet",
    prize: 100,
    type: QuestType.SHARE_WALLET,
    completed: false,
    wallet: "",
  },
  {
    icon: "/image/icon/icon_email.svg",
    description: "Share your email",
    prize: 100,
    type: QuestType.SHARE_EMAIL,
    completed: false,
    email: "",
  },
  {
    icon: "/image/icon/icon_website.png",
    link: "https://goplatform.io",
    description: "Visit our website",
    prize: 50,
    type: QuestType.VISIT_WEBSITE,
    completed: true,
  },
  {
    icon: "/image/icon/icon_airdrop.svg",
    link: "/",
    description: "$XATOM Airdrop",
    prize: 50,
    type: QuestType.COMING_SOON,
    completed: true,
  },
  // {
  // 	icon: '/image/icon/icon_twitter.svg',
  // 	link: 'https://twitter.com/gorwachain',
  // 	description: 'RT X Post',
  // 	prize: 50,
  // 	type: QuestType.RETWEET_X_POST,
  // },
];

export const verifyFollow = async (req, res) => {
  const { wallet_address, twitter_handle } = req.body;

  if (!wallet_address || !twitter_handle) {
    return res
      .status(400)
      .json({ status: "failure", message: "Missing required fields" });
  }

  try {
    // Get the user ID from Twitter handle
    // const user = await twitterClient.v2.userByUsername(twitter_handle);
    // const twitterUserId = user.data.id;
    // Get the following list of the user
    // const following = await twitterClient.v2.following(twitterUserId);
    //
    // Check if the user follows the specific account
    // const followsYourAccount = following.data.some(user => user.username === 'GoRWAChain');

    let userInfo = await User.findOne({
      wallet: wallet_address,
    });
    if (!userInfo) {
      return { status: "failure", message: "User does not exist", reward: 0 };
    }
    let taskInfo = await Task.findOne({ user: userInfo._id });
    if (taskInfo) {
      if (taskInfo.twitterHandle === "") {
        taskInfo.twitterHandle = twitter_handle;
        await taskInfo.save();
        userInfo.tokenBalance += 125;
        await userInfo.save();
        res.json({
          status: "success",
          message: "User Follows on Twitter",
          reward: 125,
        });
      } else {
        res.json({
          status: "failure",
          message: "User Follows on Twitter already",
          reward: 0,
        });
      }
    } else {
      return { status: "failure", message: "Task does not exist", reward: 0 };
    }
  } catch (error) {
    console.error("Error checking Twitter follow:", error);
    return { status: "error", message: "An error occurred", reward: 0 };
  }
};

const isValidBitcoinAddress = async (address) => {
  try {
    // Attempt to decode the address using Base58Check encoding
    const decodedHex = bs58.decode(address);

    // Ensure the decoded data is exactly 25 bytes long
    if (decodedHex.length !== 25) {
      return false;
    }

    // Extract the version byte and the hash of the public key
    const versionByte = decodedHex.slice(0, 1);
    const publicKeyHash = decodedHex.slice(1, 21);

    // Perform a basic check on the version byte and publicKeyHash
    // In a real-world scenario, you'd want to perform more thorough checks
    // For demonstration purposes, we're only checking if the version byte is not empty
    if (versionByte && versionByte.length > 0) {
      return true;
    }
  } catch (e) {
    // If decoding fails, assume the address is invalid
    return false;
  }

  // Default to false if none of the above conditions are met
  return false;
};

export const verifyTelegramJoin = async (req, res) => {
  const { wallet_address, telegram_username } = req.body;
  if (!wallet_address || !telegram_username) {
    return res
      .status(400)
      .json({ status: "failure", message: "Missing required fields" });
  }

  let userInfo = await User.findOne({
    wallet: wallet_address,
  });
  if (!userInfo) {
    return { status: "failure", message: "User does not exist", reward: 0 };
  }
  console.log(
    "userInfo: ",
    userInfo,
    "telegram_username: ",
    telegram_username,
    process.env.TGTOKEN
  );
  try {
    try {
      const member = await bot.getChatMember(chatId, telegram_username);
      if (member.status === "member" || member.status === "administrator") {
        let taskInfo = await Task.findOne({ user: userInfo._id });
        if (taskInfo) {
          if (taskInfo.telegramId === "") {
            taskInfo.telegramId = telegram_username;
            await taskInfo.save();
            userInfo.tokenBalance += 125;
            await userInfo.save();
            res.json({
              status: "success",
              message: "User joined the Telegram group",
              reward: 125,
            });
          } else {
            res.json({
              status: "failure",
              message: "User already joined the Telegram group",
              reward: 0,
            });
          }
        } else {
          return {
            status: "failure",
            message: "Task does not exist",
            reward: 0,
          };
        }
      } else {
        res.json({
          status: "failure",
          message: "User has not joined the Telegram group",
          reward: 0,
        });
      }
    } catch (error) {
      console.error(error);
      res.json({
        status: "failure",
        message: "Error checking user status",
        reward: 0,
      });
    }
  } catch (error) {
    return { status: "failure", message: error.message, reward: 0 };
  }
};

export const verifyWebsiteVisit = async (req, res) => {
  const { wallet_address } = req.body;

  if (!wallet_address) {
    return res
      .status(400)
      .json({ status: "failure", message: "Missing required fields" });
  }

  let userInfo = await User.findOne({ wallet: wallet_address });
  if (!userInfo) {
    return res
      .status(400)
      .json({ status: "failure", message: "User does not exist" });
  }

  let taskInfo = await Task.findOne({ user: userInfo._id });
  if (taskInfo) {
    if (!taskInfo.websiteVisited) {
      taskInfo.websiteVisited = true;
      await taskInfo.save();
      userInfo.tokenBalance += 50;
      await userInfo.save();
      res.json({
        status: "success",
        message: "Website visit verified",
        reward: 50,
      });
    } else {
      res.json({
        status: "failure",
        message: "Website visit already verified",
        reward: 0,
      });
    }
  } else {
    return { status: "failure", message: "Task does not exist", reward: 0 };
  }
};

export const shareBTCWallet = async (req, res) => {
  const { wallet_address, btc_wallet_address } = req.body;

  if (!wallet_address || !btc_wallet_address) {
    return res
      .status(400)
      .json({ status: "failure", message: "Missing required fields" });
  }
  if (!isValidBitcoinAddress(btc_wallet_address)) {
    return res
      .status(400)
      .json({ status: "failure", message: "Invalid Address" });
  }

  let userInfo = await User.findOne({ wallet: wallet_address });
  if (!userInfo) {
    return res
      .status(400)
      .json({ status: "failure", message: "User does not exist" });
  }

  let taskInfo = await Task.findOne({ user: userInfo._id });
  if (taskInfo) {
    if (taskInfo.btcWallet === "") {
      taskInfo.btcWallet = btc_wallet_address;
      await taskInfo.save();
      userInfo.tokenBalance += 100;
      await userInfo.save();
      res.json({
        status: "success",
        message: "User entered BTC wallet address",
        reward: 100,
      });
    } else {
      res.json({
        status: "failure",
        message: "User already entered BTC wallet address",
        reward: 0,
      });
    }
  } else {
    return { status: "failure", message: "Task does not exist", reward: 0 };
  }
};

export const shareEmailAddress = async (req, res) => {
  const { wallet_address, emailAddress } = req.body;

  if (!wallet_address || !emailAddress) {
    return res
      .status(400)
      .json({ status: "failure", message: "Missing required fields" });
  }

  let userInfo = await User.findOne({ wallet: wallet_address });
  if (!userInfo) {
    return res
      .status(400)
      .json({ status: "failure", message: "User does not exist" });
  }

  let taskInfo = await Task.findOne({ user: userInfo._id });
  if (taskInfo) {
    if (taskInfo.emailAddress === "") {
      taskInfo.emailAddress = emailAddress;
      await taskInfo.save();
      userInfo.tokenBalance += 100;
      await userInfo.save();
      res.json({
        status: "success",
        message: "Email address shared",
        reward: 100,
      });
    } else {
      res.json({
        status: "failure",
        message: "Email address already shared",
        reward: 0,
      });
    }
  } else {
    return { status: "failure", message: "Task does not exist", reward: 0 };
  }
};

export const userRewards = async (req, res) => {
  const { wallet_address } = req.body;

  if (!wallet_address) {
    return res
      .status(400)
      .json({ status: "failure", message: "Missing required fields" });
  }
  let userInfo = await User.findOne({ wallet: wallet_address });
  if (!userInfo) {
    return res
      .status(400)
      .json({ status: "failure", message: "User does not exist" });
  }

  const userRewards = await Task.findOne({
      user: userInfo._id,
  });

  console.log("user: ", userRewards);

  const rewards = rewardsConfig.map((reward) => {
    let completedReward = false;
    switch(reward.type) {
      case QuestType.FOLLOW_X:
        if (userRewards?.twitterHandle !== "") {
          completedReward = true;
        }
        break;
      case QuestType.JOIN_TELEGRAM:
        if (userRewards?.telegramId !== "") {
          completedReward = true;
        }
        break;
      case QuestType.SHARE_WALLET:
        if (userRewards?.btcWallet !== "") {
          completedReward = true;
        }
        break;
      case QuestType.SHARE_EMAIL:
        if (userRewards?.emailAddress !== "") {
          completedReward = true;
        }
        break;
      case QuestType.VISIT_WEBSITE:
        if (userRewards?.websiteVisited) {
          completedReward = true;
        }
        break;
      case QuestType.MINT_COIN:
        if (userRewards?.mintXATOMS) {
          completedReward = true;
        }
        break;
    }

    return {
      icon: reward.icon,
      link: reward.link,
      description: reward.description,
      prize: reward.prize,
      type: reward.type,
      completed: !!completedReward,
      account:
        reward.type === QuestType.FOLLOW_X
          ? userRewards?.twitterHandle
          : reward.type === QuestType.JOIN_TELEGRAM
          ? userRewards?.telegramId
          : undefined,
      wallet:
        reward.type === QuestType.SHARE_WALLET
          ? userRewards?.btcWallet
          : undefined,
      email: reward.type === QuestType.SHARE_EMAIL ? userRewards?.emailAddress : undefined,
    };
  });

  res.json(rewards);
};

export const mintXATOMS = async (req, res) => {
  const { wallet_address } = req.body;
  if (!wallet_address) {
    return res
      .status(400)
      .json({ status: "failure", message: "Missing required fields" });
  }

  let userInfo = await User.findOne({ wallet: wallet_address });
  if (!userInfo) {
    return res
      .status(400)
      .json({ status: "failure", message: "User does not exist" });
  }

  let taskInfo = await Task.findOne({ user: userInfo._id });
  if (taskInfo) {
    if (!taskInfo.mintXATOMS) {
      taskInfo.mintXATOMS = true;
      await taskInfo.save();
      userInfo.tokenBalance += 1000;
      await userInfo.save();
      res.json({
        status: "success",
        message: "User minted XATOMS",
        reward: 1000,
      });
    } else {
      res.json({
        status: "failure",
        message: "User already minted XATOMS",
        reward: 0,
      });
    }
  } else {
    return { status: "failure", message: "Task does not exist", reward: 0 };
  }
};

// exports.verifyRetweet = async (req, res) => {
// 	const { wallet_address, twitter_handle, tweet_id } = req.body;
//
// 	if (!wallet_address || !twitter_handle || !tweet_id) {
// 		return res.status(400).json({ status: 'failure', message: 'Missing required fields' });
// 	}
// 	let user = await tonService.authenticateUserInfo(wallet_address);
// 	if (user) {
// 		try {
// 			const response = await twitterClient.v2.tweetRetweetedBy(tweet_id);
//
// 			const userRetweeted = response.data.some(user => user.username === twitter_handle);
//
// 			if (userRetweeted) {
// 				await rewardUser(user.id, 'Twitter Retweet', 50);
// 				return res.json({ status: 'success', message: 'User retweeted the tweet', reward: 50 });
// 			} else {
// 				return res.json({ status: 'failure', message: 'User has not retweeted the tweet', reward: 0 });
// 			}
// 		} catch (error) {
// 			return res.status(500).json({ status: 'failure', message: error.message });
// 		}
// 	}
// };

// exports.shareEmailAddress = async (req, res) => {};

//
// app.post('/api/share-eth-wallet', async (req, res) => {
//   const { user_id, eth_wallet_address } = req.body;
//
// if (!user_id || !eth_wallet_address) {
// 	return res.status(400).json({ status: 'failure', message: 'Missing required fields' });
// }
//
//   try {
//     const user = await prisma.user.update({
//       where: { id: user_id },
//       data: { wallet: eth_wallet_address },
//     });
//
// await rewardUser(user_id, 'ETH Wallet Share', 100);
// res.json({ status: 'success', message: 'Ethereum wallet address shared', reward: 100 });
//   } catch (error) {
//     res.status(500).json({ status: 'failure', message: error.message });
//   }
// });

// app.post('/api/verify-discord-join', async (req, res) => {
//   const { user_id, discord_username } = req.body;
//
//   if (!user_id || !discord_username) {
//     return res.status(400).json({ status: 'failure', message: 'Missing required fields' });
//   }
//
//   try {
//     const response = await axios.get(`https://discord.com/api/guilds/${DISCORD_GUILD_ID}/members/${discord_username}`, {
//       headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}` },
//     });
//
//     if (response.data) {
//       await rewardUser(user_id, 'Discord Join', 125);
//       res.json({ status: 'success', message: 'User joined the Discord server', reward: 125 });
//     } else {
//       res.json({ status: 'failure', message: 'User has not joined the Discord server', reward: 0 });
//     }
//   } catch (error) {
//     res.status(500).json({ status: 'failure', message: error.message });
//   }
// });

export const test = (req, res) => {
  res.send("task route is working fine");
};

export const task = async (req, res, type) => {
  const { wallet } = req.body;
  try {
    const user = await User.findOne({ wallet });
    const userId = user._id;
    const task = await Task.findOne({ user: userId });
    if (!task) {
      res.status(400).json({ error: "Task not found" });
    } else {
      if (!task[type]) {
        user.tokenBalance += 20;
      }
      await user.save();
      task[type] = true;
      await task.save();
      res.status(200).json({ user, task });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
