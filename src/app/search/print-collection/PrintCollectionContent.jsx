
export default function PrintCollectionContent({ sidebar, content }) {

  return (
    <div className="p-10 flex justify-between">
      <div className="w-1/4 border p-4">
        {sidebar}
      </div>
      <div className="border min-w-3/4 p-4">
        {content}
      </div>
    </div>
  );
}
