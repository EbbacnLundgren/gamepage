
export const fetchAllBreeds = async () => {
  try {
    const response = await fetch('https://dog.ceo/api/breeds/list/all');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('Error fetching all breeds:', error);
    return {};
  }
};

export const fetchMultipleDogs = async (count: number) => {
  try {
    const response = await fetch(`https://dog.ceo/api/breeds/image/random/${count}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.message.map((url: string) => {
      const breed = url.split('/')[4];
      return { imageUrl: url, breed };
    });
  } catch (error) {
    console.error('Error fetching multiple dogs:', error);
    return [];
  }
};
