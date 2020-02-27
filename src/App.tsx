import React, { useEffect, useState } from 'react';
// import styled from "styled-components";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';

import './App.css';
import { getListAll, getImage } from './actions/actions';

// interface ImageContainerProp {
//   active?: boolean;
// }
// const ImageContainer = styled.div<ImageContainerProp>`
//   margin-bottom: 10px;
//   ${props => props.active && `
//     border: 1px solid red;
//   `}
// `;

function nameCapitalized(s: string) {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1);
}

interface Option {
  title: string;
  value: string;
}

interface Image {
  urls: string[];
  title: string;
}

function App() {
  const [list, setList] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageloading, setImageLoading] = useState(false);
  const [image, setImage] = useState<Image>();
  const [favs, setFavs] = useState<Option[]>([]);
  const [selectedOption, setSelectedOption] = useState<Option>();
  const [selectedImage, setSelectedImage] = useState<string>();

  useEffect(() => {
    setLoading(true);
    getListAll().then(({data}) => {
      const message = data.message;
      const result: Option[] = [];
      for (const key in message) {
        if (message[key].length > 0) {
          message[key].map(value => {
            result.push({
              title: nameCapitalized(value) + ' ' + nameCapitalized(key),
              value: key.toLowerCase() + '/' + value.toLowerCase(),
            });
            return value;
          })
        } else {
          result.push({ title: nameCapitalized(key), value: key.toLowerCase()});
        }
      }
      setList(result);
      setLoading(false);
    })
  }, []);

  const handleChange = (e: object, value: Option | null) => {
    if (value) {
      setSelectedOption(value);
      setImageLoading(true);
      getImage(value.value).then(({data}) => {
        setImageLoading(false);
        setImage({
          urls: data.message.length > 5 ? data.message.slice(0, 5) : data.message,
          title: value.title,
        });
      })
    } else {
      setImageLoading(false);
      setImage(undefined);
      setSelectedOption(undefined);
    }
  }

  const handleSaveClick = () => {
    if (selectedOption) {
      const matched = favs.find(fav => fav.title === selectedOption.title);
      if (!matched) {
        setFavs([
          ...favs,
          selectedOption,
        ]);
      }
    }
  }

  const handleImageSelect = (name: string) => {
    if (selectedImage && name === selectedImage) {
      setSelectedImage(undefined);
    } else {
      setSelectedImage(name);
    }
  }

  return (
    <div className="App">
      <Autocomplete
        loading={loading}
        id="fav-list"
        options={favs}
        getOptionLabel={option => option.title}
        style={{ width: '100%', marginBottom: '20px' }}
        renderInput={params => (
          <TextField
            {...params}
            label="Saved List"
            variant="outlined"
            InputProps={{
              ...params.InputProps
            }}
          />
        )}
        onChange={handleChange}
      />

      <Autocomplete
        loading={loading}
        id="combo-box-demo"
        options={list}
        getOptionLabel={option => option.title}
        style={{ width: '100%' }}
        renderInput={params => (
          <TextField
            {...params}
            label="Breeds List"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
        onChange={handleChange}
      />
      <button type="button" onClick={handleSaveClick}>Save</button>
      <div className="image-box">
        {imageloading && <CircularProgress color="inherit" size={20} />}
        {image && image.urls.map((url, index) => (
          <div
            style={{ marginBottom: '0.5rem'}}
            key={`${image.title}-${index}`}
            className={`image-wrapper ${selectedImage === `${image.title}-${index}` ? 'active' : ''}`}
            onClick={() => handleImageSelect(`${image.title}-${index}`)}
          >
            <img className="image" src={url} alt={image.title} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
