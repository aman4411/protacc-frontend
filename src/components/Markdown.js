import ReactMarkdown from 'react-markdown';

/**
 * Renders trusted (admin-authored) Markdown as styled React elements.
 *
 * react-markdown does NOT render embedded raw HTML by default, so this is safe
 * against HTML injection. Element styling is applied via the components map
 * because the project does not use the Tailwind typography (`prose`) plugin.
 */
const components = {
    p: ({ children }) => <p className="text-gray-700 leading-relaxed mb-4">{children}</p>,
    strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1 text-gray-700">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1 text-gray-700">{children}</ol>,
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    a: ({ href, children }) => (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 underline">
            {children}
        </a>
    ),
    h1: ({ children }) => <h3 className="text-xl font-bold text-gray-900 mb-3 mt-4">{children}</h3>,
    h2: ({ children }) => <h4 className="text-lg font-bold text-gray-900 mb-2 mt-4">{children}</h4>,
    h3: ({ children }) => <h5 className="text-base font-semibold text-gray-900 mb-2 mt-3">{children}</h5>,
    blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-indigo-200 pl-4 italic text-gray-600 mb-4">{children}</blockquote>
    ),
    code: ({ children }) => <code className="bg-gray-100 rounded px-1.5 py-0.5 text-sm text-gray-800">{children}</code>,
};

const Markdown = ({ children, className = '' }) => (
    <div className={className}>
        <ReactMarkdown components={components}>{children || ''}</ReactMarkdown>
    </div>
);

export default Markdown;
