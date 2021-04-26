export const processHashtags = (caption: string) => {
  const hashtags = caption.match(/#[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w]+/g);
  if (hashtags) {
    return hashtags.map((hashtag) => ({
      where: { hashtag },
      create: { hashtag }
    }));
  } else {
    return [];
  }
};
