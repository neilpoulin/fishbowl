import { WordEntry } from "@shared/models/Game";

export interface CompleteWordParams {
    word: WordEntry
}

export interface CompleteWordResult {
    success: boolean;
}