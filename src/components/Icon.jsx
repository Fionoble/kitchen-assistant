export function Icon({ name, filled, class: cls = "", ...props }) {
  return (
    <span
      class={`material-symbols-outlined ${filled ? "material-filled" : ""} ${cls}`}
      {...props}
    >
      {name}
    </span>
  );
}
