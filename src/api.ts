import axios from "axios";
import Dog from "./Dog";

const DOG_API_URL = "https://dog.ceo/api/breeds/image/random";

type DogResponse = {
    imageUrl: string;
    breed: string;
}

export const fetchMultipleDogs = async (count: number = 10): Promise<Dog[]> => {
    try {
      const dogPromises = Array.from({ length: count }, async () => {
        const response = await axios.get<{ message: string; status: string }>(DOG_API_URL);
        const imageUrl = response.data.message;
        const breed = imageUrl.split("/")[4].replace("-", " "); 
  
        return { imageUrl, breed };
      });
  
      return Promise.all(dogPromises);
    } catch (error) {
      console.error("Error fetching dog images:", error);
      return [];
    }
  };

export const fetchAllBreeds = async (): Promise<Record<string, string[]>> => {
    try {
        const response = await axios.get<{ message: Record<string, string[]>; status: string}>(
            `${DOG_API_URL}/breeds/list/all`
        );
        return response.data.message;
    } catch (error) {
        console.error("error");
        return {};
    }

};
