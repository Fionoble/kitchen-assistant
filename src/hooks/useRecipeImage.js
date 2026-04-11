import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { getImage } from "../stores/imageDb.js";

export function useRecipeImage(recipeId, hasImage) {
  const url = useSignal(null);

  useEffect(() => {
    if (!recipeId || !hasImage) return;
    let objectUrl;
    getImage(recipeId).then((blob) => {
      if (blob) {
        objectUrl = URL.createObjectURL(blob);
        url.value = objectUrl;
      }
    });
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [recipeId, hasImage]);

  return url;
}
