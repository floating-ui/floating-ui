export function Cards({items}) {
  return (
    <section className="my-16 flex flex-col justify-center gap-8 md:flex-row md:gap-2">
      {items.map((item) => (
        <a
          rel="noopener noreferrer"
          target="_blank"
          href={item.url}
          key={item.url}
        >
          <div className="flex flex-col items-center transition-transform">
            <img
              className="w-56 rounded-md shadow-lg transition-shadow hover:shadow-xl"
              src={item.image}
              loading="lazy"
              alt="Sponsor logo"
              width={224}
              height={168}
            />
            <div className="px-6 py-4">
              <h3 className="mb-2 text-center text-2xl font-bold">
                {item.title}
              </h3>
              <p className="text-center dark:text-gray-400">
                {item.description}
              </p>
            </div>
          </div>
        </a>
      ))}
    </section>
  );
}
