import React, { useState, useEffect } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  TextField,
  Paper,
  withStyles,
  Grid,
  Button,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import urls from '../../urls';
import styles from './Home.style';
// import Loader from '../../reusables/Loader/Loader';
// import ThreeLoader from '../../reusables/ThreeLoader/ThreeLoader';
// import Alert from '../../reusables/Alert/Alert';
import CLoader from '../../reusables/CLoader/CLoader';
import { useAlert } from '../../hoc/hocdir/Alert/alert';

const Home = ({ classes }) => {
  const [planetList, setPlanetList] = useState([]);
  const [vehicleList, setVehicleList] = useState([]);
  const [loading, setLoading] = useState(false);
  const alert = useAlert();

  // const [tokenLoading, setTokenLoading] = useState(false);
  // const [vehicleLoading, setVehicleLoading] = useState(false);
  // const [planetsLoading, setPlanetsLoading] = useState(false);
  const [tourList, setTourList] = useState([{
    planet: {
      name: '',
      distance: 0,
    },
    vehicle: {
      name: '',
      total_no: 0,
      max_distance: 0,
      speed: 0,
    },
  }]);
  const [auth, setAuth] = useState({});
  // const [selectedPlanets, setSelectedPlanets] = useState([]);
  // const [avaiPlanets, setAvaiPlanets] = useState([]);
  // const [result, setResult] = useState({});
  const [, setTotalTime] = useState(0);
  const [lengthAlert, setLengthAlert] = useState(false);
  // const [selectedVehicles, setSelectedVehicles] = useState([]);
  // const fetchFn = (url, type, successMsg, failureMsg) => {
  //   fetch(url)
  // };

  useEffect(() => {
    setLoading(true);
    fetch(`${urls.apiURL}/token`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: {

      },
    })
      .then((res) => {
        setLoading(false);
        if (res.status === 200) {
          // console.log('TOKEN FOUND SUCCESSFULLY!!');
          return res.json();
        }
        return res;
      })
      .then((res) => {
        setAuth(res);
        // console.log(res);
      })
      .catch(() => {
        setLoading(false);
        // console.error(err);
      });
    setLoading(true);
    fetch(`${urls.apiURL}/planets`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        setLoading(false);
        if (res.status === 200) {
          return res.json();
        }
        return res;
      })
      .then((res) => {
        const newRes = res.map((rr, i) => {
          rr.id = i;
          rr.position = '';
          return rr;
        });
        setPlanetList(newRes);
      })
      .catch(() => {
        setLoading(false);
        // console.error('Error while fetching planets', err);
      });
    setLoading(true);
    fetch(`${urls.apiURL}/vehicles`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        setLoading(false);
        // alert.success('All vehicles fetched!');
        if (res.status === 200) {
          return res.json();
        }
        return res;
      })
      .then((res) => {
        const newNewRes = [];
        let countTracker = 0;
        res.forEach((element) => {
          for (let k = 0; k < element.total_no; k += 1) {
            // const newObj = JSON.parse(JSON.stringify(element));
            const newObj = { ...element };
            newObj.id = countTracker;
            newObj.position = '';
            newNewRes.push(newObj);
            countTracker += 1;
          }
        });
        // console.log('after array processing...........');
        // console.log(newNewRes);
        setVehicleList(newNewRes);
      })
      .catch(() => {
        setLoading(false);
        // console.error('Error while fetching planets', err);
      });
  }, []);

  const searchClick = () => {
    if (auth.token) {
      setLoading(true);
      const body = JSON.stringify({
        token: auth.token,
        planet_names: tourList.map((tour) => tour.planet.name),
        vehicle_names: tourList.map((tour) => tour.vehicle.name),
      });
      fetch(`${urls.apiURL}/find`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        // body: JSON.stringify({
        //   token: auth.token,
        //   planet_names: ['Donlon', 'Enchai', 'Jebing', 'Sapir'],
        //   vehicle_names: ['Space pod', 'Space pod', 'Space rocket', 'Space shuttle'],
        // }),
        body,
      })
        .then((res) => {
          setLoading(false);
          if (res.status === 200) {
            // console.log('search for planets complete with 200 response');
            return res.json();
          }
          return res;
        })
        .then((res) => {
          // setResult(res);
          alert.success(res.status === 'success' ? `Falcone found at ${res.planet_name}` : 'Not found. Better luck next time!');
          // alert(res.status === 'success'
          // ? `Falcone found at ${res.planet_name}` : 'Not found. Better luck next time!');
          // console.log(res);
        })
        .catch(() => {
          alert.error('An error occured.');
          setLoading(false);
          // console.error(err);
        });
    }
  };

  useEffect(() => {
    const fullTime = tourList.reduce(
      (acc, tourcurr) => acc + ((tourcurr.planet && tourcurr.vehicle)
        ? (tourcurr.planet.distance / tourcurr.vehicle.speed) : 0), 0,
    );
    if (fullTime) {
      // alert.success(`${fullTime}`);
      setTotalTime(fullTime);
    }
  }, [tourList]);

  const reset = () => {
    setPlanetList(planetList.map((planet) => {
      planet.position = '';
      return planet;
    }));

    setVehicleList(vehicleList.map((vehicle) => {
      vehicle.position = '';
      return vehicle;
    }));

    setTourList([{
      planet: {
        name: '',
        distance: 0,
      },
      vehicle: {
        name: '',
        total_no: 0,
        max_distance: 0,
        speed: 0,
      },
    }]);
  };

  const addNewTourHandler = () => {
    if (tourList.length >= 4) {
      alert.warning('Only 4 tours allowed!');
    } else {
      setTourList((oldarr) => [...oldarr, {
        planet: {
          name: '',
          distance: 0,
        },
        vehicle: {
          name: '',
          total_no: 0,
          max_distance: 0,
          speed: 0,
        },
      }]);
    }
  };

  const dropdownChanged = (newValue, tour, tourId, state, setState, stateKey) => {
    const tempTour = { ...tour };
    const tempTourList = [...tourList];
    tempTour[stateKey] = newValue;
    tempTourList[tourId] = tempTour;
    setTourList(tempTourList);

    const stateTemp = [...state];
    const selectedOne = stateTemp.find((stt) => stt.position === tourId);
    // console.log(selectedOne);
    if (selectedOne) {
      selectedOne.position = '';
      stateTemp[selectedOne.id] = selectedOne;
    }
    if (newValue) {
      stateTemp[newValue.id].position = tourId;
    }
    setState(stateTemp);
  };
  useEffect(() => {
    if (lengthAlert) {
      alert.warning('Length issue........');
      setLengthAlert(false);
    }
  }, [lengthAlert]);
  return (
    <Paper className={classes.paper}>
      <Grid key={4} container>
        {tourList.length !== 0 && tourList.map((tour, tourId) => (
          <>
            <Grid item md={3} key={`tourList-${tourId}`}>
              <Autocomplete
                value={tour.vehicle}
                onChange={(event, newValue) => {
                  dropdownChanged(newValue, tour, tourId, vehicleList, setVehicleList, 'vehicle');
                }}
                key={`vehicles-autocomplete-${tourId}`}
                options={vehicleList.filter((vehicle) => vehicle.position === '' || vehicle.position === tourId)}
                getOptionLabel={(option) => (option.name)}
                style={{ width: 300 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Choose a Vehicle"
                    variant="outlined"
                  />
                )}
              />
              <br />
              <Autocomplete
                value={tour.planet}
                onChange={(event, newValue) => {
                  dropdownChanged(newValue, tour, tourId, planetList, setPlanetList, 'planet');
                }}
                key={`planets-autocomplete-${tourId}`}
                options={planetList.filter((planet) => planet.position === '' || planet.position === tourId)}
                getOptionLabel={(option) => option.name}
                style={{ width: 300 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Choose a Planet"
                    variant="outlined"
                  />
                )}
              />
              <br />
              <Button
                // style={tourList.length - 1 === tourId ? {display: 'none'} : {}}
                color="primary"
                variant="contained"
                onClick={addNewTourHandler}
              >
                <AddIcon />
              </Button>
              <br />
            </Grid>
          </>
        ))}
      </Grid>
      <Button
        disabled={tourList.length < 4 || tourList.some((e) => !e.planet?.name || !e.vehicle?.name)}
        color="secondary"
        variant="contained"
        onClick={searchClick}
      >
        Submit
      </Button>
      <Button
        color="secondary"
        variant="contained"
        style={{ marginLeft: '20px' }}
        onClick={reset}
      >
        Reset
      </Button>
      {/* <Loader size={24} style={{ display: 'none' }} /> */}
      <CLoader open={loading} />
      {/* <Alert type="info" message="This is info" isDefaultShown /> */}
    </Paper>
  );
};

export default withStyles(styles)(Home);
