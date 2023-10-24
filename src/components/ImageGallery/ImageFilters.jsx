import React, { useEffect, useState } from 'react';
import { GrPowerReset } from 'react-icons/gr';
import { IoClose } from 'react-icons/io5';
import { RiImageAddFill } from 'react-icons/ri';
import { colorCodeDistances, intensityDistances } from '../../methods/Assignment_1';
import { getShortestDistancesIndexes } from '../../methods/Main';
import { imageArray } from '../../constants/ImageList';

export const ImageFilters = ({
  currentImg,
  setCurrentImage,
  imagesList,
  setImagesList,
  setCurrentPage,
  setRelevantImages,
  isRelevance,
  setIsRelevance,
}) => {
  const [currentImgURL, setCurrentImageURL] = useState('');

  const setNewList = (setState, _modifiedList) => {
    const newList = [];
    for (let i = 0; i < _modifiedList.length; ++i) {
      newList.push(imageArray[_modifiedList[i]]);
    }

    setState(newList);
  };

  const filterMethod = async (_currentImg, methodBy) => {
    if (_currentImg === -1) {
      return;
    }

    setCurrentImage(-1);

    const distances =
      methodBy === 'intensity'
        ? await intensityDistances()
        : methodBy === 'colorCode'
        ? await colorCodeDistances()
        : null;

    const modifiedList = distances === null ? imageArray : getShortestDistancesIndexes(distances, _currentImg - 1);

    setNewList(setImagesList, modifiedList);
    setCurrentImage(_currentImg);
    setCurrentPage(1);
  };

  const enableRelevanceFeedback = (event) => {
    setIsRelevance(event.target.checked);
  };

  useEffect(() => {
    if (!imagesList) {
      setCurrentImageURL('');
      return;
    }

    const selectedImg = imagesList.find((img) => img.id === currentImg);
    setCurrentImageURL(!selectedImg ? '' : selectedImg.image);
  }, [currentImg]);

  return (
    <div className="imageGallery__contentWraps imageSelectDisplay">
      <div className="imageGallery__imageSelectDisplay__selectedImage">
        {currentImg !== -1 && (
          <div className="imageGallery__imageSelectDisplay__selectedImage__imageActionBtns">
            <button
              onClick={() => {
                setImagesList(imageArray);
                setCurrentPage(1);
                setCurrentImage(imageArray[0].id);
                setIsRelevance(false);
                setRelevantImages([]);
              }}
              className="imageGallery__imageSelectDisplay__selectedImage__imageActionBtns__resetBtn"
            >
              <GrPowerReset />
            </button>
            <button
              onClick={() => setCurrentImageURL('')}
              className="imageGallery__imageSelectDisplay__selectedImage__imageActionBtns__closeBtn"
            >
              <IoClose />
            </button>
          </div>
        )}

        <div
          style={{ background: currentImg !== -1 && currentImgURL ? 'transparent' : '#efedfc' }}
          className="imageGallery__imageSelectDisplay__selectedImage__imageWrap"
        >
          {currentImg !== -1 && currentImgURL ? (
            <React.Fragment>
              <img src={currentImgURL} alt="" />
              <span className="imageGallery__imageSelectDisplay__selectedImage__imageWrap__number">{currentImg}</span>
            </React.Fragment>
          ) : (
            <div className="imageGallery__imageSelectDisplay__selectedImage__noImage">
              <span className="imageGallery__imageSelectDisplay__selectedImage__noImage__noImgIcon">
                <RiImageAddFill />
              </span>
              <p className="imageGallery__imageSelectDisplay__selectedImage__noImage__noImageMsg">
                Select an Image to Apply Filters
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="imageGallery__imageSelectDisplay__filterActionText">Retrieve By</div>
      <div className="imageGallery__imageSelectDisplay__filterActionRelevance">
        <input
          type="checkbox"
          name="relevance"
          id="relevance"
          checked={isRelevance}
          onChange={(event) => enableRelevanceFeedback(event)}
        />
        <label htmlFor="relevance">Relevance</label>
      </div>
      <div className="imageGallery__imageSelectDisplay__filterActionBtns">
        <button
          disabled={currentImg === -1 || imagesList === null || isRelevance}
          onClick={() => filterMethod(currentImg, 'intensity')}
        >
          Intensity Method
        </button>
        <button
          disabled={currentImg === -1 || imagesList === null || isRelevance}
          onClick={() => filterMethod(currentImg, 'colorCode')}
        >
          Color Code Method
        </button>
        <button disabled={true || isRelevance}>Energy Method</button>
        <button disabled={true || isRelevance}>Entropy Method</button>
        <button disabled={true || isRelevance}>Contrast Method</button>
        <button disabled={true || isRelevance} className="smallText">
          Color Code & Texture
        </button>
        <button disabled={currentImg === -1 || imagesList === null} className="fullRow">
          Color Code & Intensity
        </button>
        <button disabled={true || isRelevance} className="fullRow">
          Color Code, Intensity & Texture
        </button>
      </div>
    </div>
  );
};
