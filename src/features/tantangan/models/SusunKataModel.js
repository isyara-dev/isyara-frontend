class SusunKataModel {
  constructor() {
    this.word = "";
    this.letters = [];
    this.currentIndex = 0;
    this.currentHint = null;
    this.points = 0;
    this.bestScore = 0;
    this.isLoading = true;
    this.completedWordIds = [];
    this.currentWordData = null;
    this.isTransitioningWord = false;
    this.animatingLetterIndex = null;
    this.isNavigating = false;
  }

  setWordData(wordData) {
    this.currentWordData = wordData;
    const wordStr = wordData.word.toUpperCase();
    this.word = wordStr;
    this.letters = wordStr.split("");
    this.currentIndex = 0;
  }

  setHint(hint) {
    this.currentHint = hint;
  }

  setLoading(isLoading) {
    this.isLoading = isLoading;
  }

  setCurrentIndex(index) {
    this.currentIndex = index;
  }

  setAnimatingLetterIndex(index) {
    this.animatingLetterIndex = index;
  }

  setIsTransitioningWord(isTransitioning) {
    this.isTransitioningWord = isTransitioning;
  }

  addPoints(points) {
    this.points += points;
    if (this.points > this.bestScore) {
      this.bestScore = this.points;
    }
  }

  setBestScore(score) {
    this.bestScore = score;
  }

  addCompletedWordId(wordId) {
    if (!this.completedWordIds.includes(wordId)) {
      this.completedWordIds.push(wordId);
    }
  }

  resetForNewWord() {
    this.currentIndex = 0;
    this.animatingLetterIndex = null;
    this.isTransitioningWord = false;
  }

  isWordCompleted() {
    return this.currentIndex >= this.letters.length;
  }

  setNavigating(isNavigating) {
    this.isNavigating = isNavigating;
  }
}

export default SusunKataModel;
