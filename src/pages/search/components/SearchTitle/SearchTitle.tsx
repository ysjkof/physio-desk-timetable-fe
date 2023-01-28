import { ListCell } from '../../../../components';

export const SearchTitle = ({ subject }: { subject: string[] }) => {
  return (
    <div className="grid grid-cols-[1fr,4rem,1fr,3rem,5rem,5rem] divide-x border-b-2 sm:px-6 lg:grid-cols-6">
      {subject.map((title) => (
        <ListCell key={title} className="">
          {title}
        </ListCell>
      ))}
    </div>
  );
};
