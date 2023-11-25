import {twMerge} from 'tailwind-merge';

export function PageCard(props) {
  return (
    <div
      {...props}
      className={twMerge(
        'relative my-4 mb-10 rounded-3xl bg-white bg-gradient-to-br from-blue-50 to-gray-50 p-8 pb-4 shadow-inner shadow-cyan-500/10 dark:border-none dark:bg-gray-700 dark:from-purple-700/10 dark:to-cyan-700/10 dark:shadow lg:mt-0 lg:p-12 lg:pb-6 [&_h1]:relative [&_h1]:z-10 [&_h1]:m-0 [&_h1]:inline-block [&_h1]:bg-gradient-to-br [&_h1]:from-pink-400 [&_h1]:via-rose-500 [&_h1]:to-rose-700 [&_h1]:bg-clip-text [&_h1]:pb-2 [&_h1]:leading-[1.1] [&_h1]:text-transparent dark:[&_h1]:from-rose-400 dark:[&_h1]:to-purple-400/90 dark:[&_:not(pre)>code]:bg-gray-800 [&_>p]:mt-0 [&_>p]:text-lg [&_>p]:leading-normal dark:[&_>p]:text-purple-200/90 md:[&_>p]:text-xl md:[&_>p]:leading-relaxed [&_>pre]:bg-gray-100/30 dark:[&_>pre]:border-gray-600/50 dark:[&_>pre]:bg-gray-900',
        props.className,
      )}
    />
  );
}
