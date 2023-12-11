import axios from 'axios';


export async function staticLoadMarkdown(localpath: string){
    try {
     
      const response = await fetch(`../${localpath}`);
      const text = await response.text();
      return text;
    } catch (error) {
      console.error(error);
    }
  };