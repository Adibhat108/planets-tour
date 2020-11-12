/* eslint-disable no-console */
/* eslint-disable linebreak-style */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-alert */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
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
import Loader from '../../reusables/Loader/Loader';
import ThreeLoader from '../../reusables/ThreeLoader/ThreeLoader';
import CLoader from '../../reusables/CLoader/CLoader';
import Alert from '../../reusables/Alert/Alert';
import { useAlert } from '../../hoc/hocdir/Alert/alert';

const Home = ({ classes }) => {
  const [planetList, setPlanetList] = useState([]);
  const [vehicleList, setVehicleList] = useState([]);
  const [loading, setLoading] = useState(false);
  // const alert = useAlert();
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
  const [selectedPlanets, setSelectedPlanets] = useState([]);
  const [avaiPlanets, setAvaiPlanets] = useState([]);
  const [auth, setAuth] = useState({});
  const [result, setResult] = useState({});
  const [totalTime, setTotalTime] = useState(0);
  // const [selectedVehicles, setSelectedVehicles] = useState([]);

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
      .catch((err) => {
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
      .catch((err) => {
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
        // const newRes = res.map((rr, i) => {
        //   rr.id = i;
        //   rr.position = '';
        //   return rr;
        // });
        const newNewRes = [];
        let countTracker = 0;
        // const vehicleCount = res.reduce((acc, vehicleCurr) => acc + vehicleCurr.total_no, 0);
        // for (let k = 0; k < res.length; k += 1) {
        //   for (let i = 0; i < res[k].total_no; i += 1) {
        //     countTracker += k + i;
        //     res[k].id = countTracker;
        //     res[k].position = '';
        //     newNewRes.push(res[k]);
        //   }
        // }
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
      .catch((err) => {
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
          setResult(res);
          alert(res.status === 'success' ? `Falcone found at ${res.planet_name}` : 'Not found. Better luck next time!');
          // console.log(res);
        })
        .catch((err) => {
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
      setTotalTime(fullTime);
    }
  }, [tourList]);

  return (
    <Paper className={classes.paper}>
      <Grid container>
        {tourList.length !== 0 && tourList.map((tour, tourId) => (
          <>
            <br />
            <Grid item md={3}>
              <Autocomplete
                value={tour.vehicle}
                onChange={(event, newValue) => {
                  // setVehicleChosen(newValue);
                  const tempTour = { ...tour };
                  const tempTourList = [...tourList];
                  tempTour.vehicle = newValue;
                  tempTourList[tourId] = tempTour;
                  setTourList(tempTourList);

                  const vehiclelistTemp = [...vehicleList];
                  const selectedOne = vehiclelistTemp.find((vehi) => vehi.position === tourId);
                  // console.log(selectedOne);
                  if (selectedOne) {
                    selectedOne.position = '';
                    vehiclelistTemp[selectedOne.id] = selectedOne;
                  }
                  if (newValue) {
                    vehiclelistTemp[newValue.id].position = tourId;
                  }
                  setVehicleList(vehiclelistTemp);
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
                  // setPlanetChosen(newValue);
                  const tempTour = { ...tour };
                  const tempTourList = [...tourList];
                  tempTour.planet = newValue;
                  tempTourList[tourId] = tempTour;
                  setTourList(tempTourList);

                  const planetlistTemp = [...planetList];
                  const selectedOne = planetlistTemp.find((planet) => planet.position === tourId);
                  // console.log(selectedOne);
                  if (selectedOne) {
                    selectedOne.position = '';
                    planetlistTemp[selectedOne.id] = selectedOne;
                  }
                  if (newValue) {
                    planetlistTemp[newValue.id].position = tourId;
                  }
                  setPlanetList(planetlistTemp);
                }}
                key={`planets-autocomplete-${tourId}`}
                options={planetList.filter((planet) => (planet.position === '' || planet.position === tourId))}
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
                onClick={() => {
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
                }}
              >
                <AddIcon />
              </Button>
              <br />
            </Grid>
          </>
        ))}
        <Button type="button" onClick={searchClick}>
          Submit
        </Button>
      </Grid>
      {/* <Loader size={24} style={{ display: 'none' }} /> */}
      <CLoader open={loading} />
      {/* <Alert type="error" message="This is info" isDefaultShown /> */}
    </Paper>
  );
};

export default withStyles(styles)(Home);
