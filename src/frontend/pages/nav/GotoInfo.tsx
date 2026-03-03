interface GotoInfoProps {
  name: string;
  imgUrl: string;
  linkText: string;
  linkUrl: string;
}

export function GotoInfo(props: GotoInfoProps) {
  return (
    <div key={props.name}>
      <img src={props.imgUrl} className="h-6 w-6" />
      <a className="hover:text-white" href={props.linkUrl}>
        {props.linkText}
      </a>
    </div>
  );
}

export default function GotoInfoPage() {
  return null;
}
