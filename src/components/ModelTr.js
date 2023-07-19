import React from 'react';

const ModelTr = ({ number, id, likes, downloads, lastModified }) => {
	const modelUrl = `https://huggingface.co/${id}`;

  return (
    <tr className="border-b dark:border-neutral-500">
      <td className="whitespace-nowrap px-6 py-4 overflow-x-auto">{number}</td>
			{/* Only id click open modelUrl by new tab */}
			<td className="whitespace-nowrap px-6 py-4 overflow-x-auto"><a href={modelUrl} target="_blank" rel="noreferrer">{id}</a></td>
      <td className="whitespace-nowrap px-6 py-4 overflow-x-auto">{likes}</td>
      <td className="whitespace-nowrap px-6 py-4 overflow-x-auto">{downloads}</td>
      <td className="whitespace-nowrap px-6 py-4 overflow-x-auto">{lastModified}</td>
    </tr>
  );
};

export default ModelTr;