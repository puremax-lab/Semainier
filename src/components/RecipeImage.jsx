/** The recipe photo from RecetteVie, or a plain block with the first letter when there is none. */
export default function RecipeImage({ src, title, className = 'recipe-image' }) {
  return src
    ? <img className={className} src={src} alt="" loading="lazy" />
    : <span className={`${className} recipe-image-empty`} aria-hidden="true">{title.charAt(0)}</span>
}
