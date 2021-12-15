export default function Cards({items}) {
  const paddingLeft = Math.floor((3 - items.length) / 2);
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 my-10">
      {Array.from({length: paddingLeft}, (_, index) => (
        <div key={index}>&nbsp;</div>
      ))}

      {items.map((item) => (
        <a
          rel="noopener noreferrer"
          target="_blank"
          href={item.url}
          key={item.url}
        >
          <div className="flex flex-col items-center hover:scale-105 transition-transform">
            <img
              className="w-64 rounded-md shadow-lg hover:shadow-xl transition-shadow"
              src={item.image}
            />
            <div className="px-6 py-4">
              <h1 className="text-center text-2xl">
                {item.title}
              </h1>
              <p className="text-center text-sm">
                {item.description}
              </p>
            </div>
          </div>
        </a>
      ))}
    </section>
  );
}
