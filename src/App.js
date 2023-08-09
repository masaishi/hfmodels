import React, { useEffect, useState } from 'react';
import ModelTr from './components/ModelTr';

const App = () => {
  const [originalData, setOriginalData] = useState([]);
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('text-to-image');
  const [minLikes, setMinLikes] = useState(5);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const fetchModels = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const url = `https://huggingface.co/api/models?limit=${page * 1000}&filter=${filter}&sort=lastModified&direction=-1`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      let jsonData = await response.json();
      jsonData = [...originalData, ...jsonData].reduce((acc, current) => {
        const x = acc.find((item) => item.id === current.id);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);
      setOriginalData(jsonData);

      const filteredData = jsonData.filter((model) => model.likes >= minLikes);
      setData(filteredData);
    } catch (error) {
      console.log('Error:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const filteredData = originalData.filter((model) => model.likes >= minLikes);
    setData(filteredData);
  }, [minLikes]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOriginalData([]);
      setData([]);
      setPage(1);
      fetchModels();
    }, 1000);
    return () => clearTimeout(timer);
  }, [filter]);

  useEffect(() => {
    fetchModels();
  }, [page]);

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight && !isLoading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="w-screen flex flex-col">
      <div className="flex flex-col md:flex-row items-center justify-between px-6 py-4 w-screen">
        <div className="w-1/2">
          <label htmlFor="filterSelect" className="mr-2 font-medium">
            Filter:
          </label>
          <select
            id="filterSelect"
            className="px-2 py-1 border border-gray-300 rounded w-8/12"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <optgroup label="Multimodal">
              <option value="feature-extraction">Feature Extraction</option>
              <option value="text-to-image">Text-to-Image</option>
              <option value="image-to-text">Image-to-Text</option>
              <option value="text-to-video">Text-to-Video</option>
              <option value="visual-question-answering">Visual Question Answering</option>
              <option value="document-question-answering">Document Question Answering</option>
              <option value="graph-machine-learning">Graph Machine Learning</option>
            </optgroup>
            <optgroup label="Computer Vision">
              <option value="depth-estimation">Depth Estimation</option>
              <option value="image-classification">Image Classification</option>
              <option value="object-detection">Object Detection</option>
              <option value="image-segmentation">Image Segmentation</option>
              <option value="image-to-image">Image-to-Image</option>
              <option value="unconditional-image-generation">Unconditional Image Generation</option>
              <option value="video-classification">Video Classification</option>
              <option value="zero-shot-image-classification">Zero-Shot Image Classification</option>
            </optgroup>
            <optgroup label="Natural Language Processing">
              <option value="text-classification">Text Classification</option>
              <option value="token-classification">Token Classification</option>
              <option value="table-question-answering">Table Question Answering</option>
              <option value="question-answering">Question Answering</option>
              <option value="zero-shot-classification">Zero-Shot Classification</option>
              <option value="translation">Translation</option>
              <option value="summarization">Summarization</option>
              <option value="conversational">Conversational</option>
              <option value="text-generation">Text Generation</option>
              <option value="text2text-generation">Text2Text Generation</option>
              <option value="fill-mask">Fill-Mask</option>
              <option value="sentence-similarity">Sentence Similarity</option>
            </optgroup>
            <optgroup label="Audio">
              <option value="text-to-speech">Text-to-Speech</option>
              <option value="automatic-speech-recognition">Automatic Speech Recognition</option>
              <option value="audio-to-audio">Audio-to-Audio</option>
              <option value="audio-classification">Audio Classification</option>
              <option value="voice-activity-detection">Voice Activity Detection</option>
            </optgroup>
            <optgroup label="Tabular">
              <option value="tabular-classification">Tabular Classification</option>
              <option value="tabular-regression">Tabular Regression</option>
            </optgroup>
            <optgroup label="Reinforcement Learning">
              <option value="reinforcement-learning">Reinforcement Learning</option>
              <option value="robotics">Robotics</option>
            </optgroup>
          </select>
        </div>
        <div className='w-1/2'>
          <label htmlFor="likesSlider" className="mr-2 font-medium">
            Min Likes:
          </label>
          <input
            type="range"
            id="likesSlider"
            className="w-8/12"
            min="0"
            max="100"
            step="1"
            value={minLikes}
            onChange={(e) => setMinLikes(Number(e.target.value))}
          />
          <span className="ml-2">{minLikes}</span>
        </div>
      </div>
      <table className="w-full text-left text-sm font-light table-fixed">
        <thead className="w-full border-b font-medium dark:border-neutral-500">
          <tr className='w-full'>
            <th scope="col" className="px-6 py-4 w-1/12">
              #
            </th>
            <th scope="col" className="px-6 py-4 w-6/12 overflow-x-auto">
              ID
            </th>
            <th scope="col" className="px-6 py-4 w-1/12">
              Likes
            </th>
            <th scope="col" className="px-6 py-4 w-1/12">
              Downloads
            </th>
            <th scope="col" className="px-6 py-4 overflow-x-auto">
              Last Modified
            </th>
          </tr>
        </thead>
        <tbody id="models-body">
          {data.map((model, index) => (
            <ModelTr
              key={model.id}
              number={index + 1}
              id={model.id}
              likes={model.likes}
              downloads={model.downloads}
              lastModified={model.lastModified}
            />
          ))}
        </tbody>
      </table>
      {isLoading && <p className="text-center py-2">Loading...</p>}
    </div>
  );
};

export default App;