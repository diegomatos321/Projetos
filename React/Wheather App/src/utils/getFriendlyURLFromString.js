/* 
	Créditos para: https://gist.github.com/codeguy/6684588
*/

export default function slugify(text) {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}



/* export default function getFriendlyURLFromString(string){
  return encodeURIComponent(string.trim().toLowerCase());
} */