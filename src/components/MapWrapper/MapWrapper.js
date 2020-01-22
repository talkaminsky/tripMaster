import React, { Component } from 'react';

import { Map, Marker } from 'google-maps-react';

class Contents extends Component {
    state = {
        position: null
    };

    componentDidMount() {
        this.renderAutoComplete();
    }

    componentDidUpdate(prevProps) {
        if (this.props !== prevProps.map) this.renderAutoComplete();
    }

    renderAutoComplete() {
        const { google, map } = this.props;

        if (!google || !map) return;

        const autocomplete = new google.maps.places.Autocomplete(this.autocomplete);
        autocomplete.bindTo('bounds', map);

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();

            if (!place.geometry) return;

            if (place.geometry.viewport) map.fitBounds(place.geometry.viewport);
            else {
                map.setCenter(place.geometry.location);
                map.setZoom(17);
            }

            this.setState({ position: place.geometry.location });
        });
    }

    render() {
        const { position } = this.state;

        return (
            <div>
                <div>
                    <input
                        placeholder="Enter a location"
                        ref={ref => (this.autocomplete = ref)}
                        type="text"
                    />
                    <div>
                        <div>Lat: {position && position.lat()}</div>
                        <div>Lng: {position && position.lng()}</div>
                    </div>
                </div>

                <Map
                    {...this.props}
                    center={position}
                    centerAroundCurrentLocation={false}
                    containerStyle={{
                        height: '400px',
                        position: 'relative',
                        width: '100%'
                    }}>
                    <Marker position={position} />
                </Map>
            </div>
        );
    }
}

const MapWrapper = props => (
    <Map className="map" google={window.google} visible={false}>
        <Contents {...props} />
    </Map>
);

export default MapWrapper;