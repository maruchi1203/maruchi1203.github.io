interface MenuListItemProps {
  menuName: string;
  linkUrl: string;
}

export default function MenuListItem(props: MenuListItemProps) {
  const { menuName, linkUrl } = props;

  return (
    <div className="h-9 gap-7 text-lg">
      <a href={linkUrl}>{menuName}</a>
    </div>
  );
}
