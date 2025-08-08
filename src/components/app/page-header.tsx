import { type FC } from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
};

export const PageHeader: FC<PageHeaderProps> = ({ title, description }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight font-headline text-primary">
        {title}
      </h1>
      {description && (
        <p className="text-lg text-muted-foreground mt-1">{description}</p>
      )}
    </div>
  );
};
