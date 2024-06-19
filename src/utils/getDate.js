export const getDate = () => {
    const milliseconds = Date.now();
    const dateNum = Math.floor(milliseconds / 1000 / 60 / 60 / 24);
    return dateNum;
}