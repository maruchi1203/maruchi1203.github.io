import MenuListItem from "./container/MenuListItem";

export default function NavMenuSection() {
  const menus = [
    { name: "블로그", linkUrl: "/" },
    { name: "프로젝트", linkUrl: "/project" },
    { name: "포트폴리오", linkUrl: "/portfolio" },
  ];

  return (
    <div className="rounded-md bg-white p-4 shadow-sm dark:bg-neutral-900">
      {menus.map((element) => (
        <MenuListItem menuName={element.name} linkUrl={element.linkUrl} />
      ))}
    </div>
  );
}
