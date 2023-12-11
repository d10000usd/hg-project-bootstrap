
export  const generateRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};



export const  generateImageUrl= () => {
  const randomNumber = generateRandomNumber(12, 40);
  return `https://raw.githubusercontent.com/d10000usd/WebDocuments/main/public/icon/space/workspace-vector-free-icon-set-${randomNumber}.png`;
};


export const generateImageUrlHTML = (): string => {
  const randomNumber: number = generateRandomNumber(12, 40);
  const imageUrl: string = `https://raw.githubusercontent.com/d10000usd/WebDocuments/main/public/icon/space/workspace-vector-free-icon-set-${randomNumber}.png`;

  return `<img src="${imageUrl}" class="card-img-top" alt="Image" width="220" height="220" />`;
};