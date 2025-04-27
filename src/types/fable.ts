export interface Fable {
  title: string;
  text: string;
  moral: string;
  illustrations: { prompt: string; image: string }[];
}

export interface FableGenerationOptions {
  worldDescription: string;
  mainCharacter: string;
  age: number;
  numImages: number;
} 