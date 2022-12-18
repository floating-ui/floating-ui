export function Cards({items}) {
  return (
    <section className="flex flex-col md:flex-row gap-8 md:gap-2 justify-center my-16">
      {items.map((item) => (
        <a
          rel="noopener noreferrer"
          target="_blank"
          href={item.url}
          key={item.url}
        >
          <div className="flex flex-col items-center transition-transform">
            <img
              className="w-56 rounded-md shadow-lg hover:shadow-xl transition-shadow"
              src={item.image}
              loading="lazy"
              alt="Sponsor logo"
              width={224}
              height={168}
            />
            <div className="px-6 py-4">
              <h3 className="text-center text-2xl font-bold mb-2">
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
