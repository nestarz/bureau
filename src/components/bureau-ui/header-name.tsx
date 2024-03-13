import getExtendedType from "@/src/lib/getExtendedType.ts";
import { Badge } from "@/src/components/ui/badge.tsx";
import formatColumnName from "@/src/lib/formatColumnName.ts";

interface HeaderNameProps {
  name: string;
}

export const HeaderName = ({ name }: HeaderNameProps): JSX.Element => {
  const type = getExtendedType(name, "");
  return (
    <div className="flex gap-1 items-center">
      <span>{formatColumnName(name)}</span>
      {type && (
        <Badge variant="outline" className="uppercase scale-90 px-2">
          {type}
        </Badge>
      )}
    </div>
  );
};

export default HeaderName;
