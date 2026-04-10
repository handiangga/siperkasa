import Tooltip from "./Tooltip";

export default function IconButton({
  icon: Icon,
  onClick,
  color = "green",
  tooltip = "",
}) {
  const colors = {
    blue: "bg-blue-500 hover:bg-blue-600",
    yellow: "bg-yellow-400 hover:bg-yellow-500 text-black",
    red: "bg-red-500 hover:bg-red-600",
    green: "bg-green-700 hover:bg-green-800",
  };

  return (
    <Tooltip text={tooltip}>
      <button
        onClick={onClick}
        className={`
          ${colors[color] || colors.green}
          text-white
          p-2
          rounded-lg
          transition
          duration-200
          hover:scale-110
          hover:shadow-md
          active:scale-95
        `}
      >
        {Icon ? <Icon size={16} /> : null}
      </button>
    </Tooltip>
  );
}
