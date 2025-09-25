import CategoryVoice from "./voice";

export default interface CategoryState {
  isGenerating: boolean;
  voices: CategoryVoice[];
  isGenerated: boolean;
}