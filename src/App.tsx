import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';

import './App.css';
import { getListAll, getImage } from './actions/actions';

function nameCapitalized(s: string) {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1);
}

interface Option {
  title: string;
  value: string;
}

interface Image {
  url: string;
  title: string;
}

function App() {
  const [list, setList] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageloading, setImageLoading] = useState(false);
  const [image, setImage] = useState<Image>();

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
              value: value.toLowerCase() + ' ' + key.toLowerCase(),
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
      setImageLoading(true);
      getImage(value.value).then(({data}) => {
        setImageLoading(false);
        setImage({
          url: data.message,
          title: value.title,
        });
      })
    } else {
      setImage(undefined);
    }
  }

  return (
    <div className="App">
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
      <div className="image-box">
        {imageloading && <CircularProgress color="inherit" size={20} />}
        {image && <img className="image" src={image.url} alt={image.title} />}
      </div>
    </div>
  );
}

export default App;
