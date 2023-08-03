export type DraftPlace = {
  kind: 37515,
  tags: string[][]
  content: {
    type: "Feature",
    geometry: {
      coordinates: [number, number],
      type: "Point"
    },
    properties: {
      name: string,
      abbrev?: string,
      description: string,
      address?: {
        "street-address"?: string,
        locality?: string, // city
        region?: string, // state
        "country-name"?: string,
        "postal-code"?: string,
      },
      type: GooglePlaceType,
      status?: GooglePlaceStatus,
      website?: string,
      phone?: string,
      hours?: string,
    }
  }
}

export type GooglePlaceStatus = 'CLOSED_TEMPORARILY' | 'CLOSED_PERMANENTLY' | 'OPERATIONAL'

export type GooglePlaceType = 'accounting' | 'airport' | 'amusement_park' | 'aquarium' | 'art_gallery' | 'atm' | 'bakery' | 'bank' | 'bar' | 'beauty_salon' | 'bicycle_store' | 'book_store' | 'bowling_alley' | 'bus_station' | 'cafe' | 'campground' | 'car_dealer' | 'car_rental' | 'car_repair' | 'car_wash' | 'casino' | 'cemetery' | 'church' | 'city_hall' | 'clothing_store' | 'convenience_store' | 'courthouse' | 'dentist' | 'department_store' | 'doctor' | 'drugstore' | 'electrician' | 'electronics_store' | 'embassy' | 'fire_station' | 'florist' | 'funeral_home' | 'furniture_store' | 'gas_station' | 'gym' | 'hair_care' | 'hardware_store' | 'hindu_temple' | 'home_goods_store' | 'hospital' | 'insurance_agency' | 'jewelry_store' | 'laundry' | 'lawyer' | 'library' | 'light_rail_station' | 'liquor_store' | 'local_government_office' | 'locksmith' | 'lodging' | 'meal_delivery' | 'meal_takeaway' | 'mosque' | 'movie_rental' | 'movie_theater' | 'moving_company' | 'museum' | 'night_club' | 'painter' | 'park' | 'parking' | 'pet_store' | 'pharmacy' | 'physiotherapist' | 'plumber' | 'police' | 'post_office' | 'primary_school' | 'real_estate_agency' | 'restaurant' | 'roofing_contractor' | 'rv_park' | 'school' | 'secondary_school' | 'shoe_store' | 'shopping_mall' | 'spa' | 'stadium' | 'storage' | 'store' | 'subway_station' | 'supermarket' | 'synagogue' | 'taxi_stand' | 'tourist_attraction' | 'train_station' | 'transit_station' | 'travel_agency' | 'university' | 'veterinary_care' | 'zoo' | 'administrative_area_level_1' | 'administrative_area_level_2' | 'administrative_area_level_3' | 'administrative_area_level_4' | 'administrative_area_level_5' | 'administrative_area_level_6' | 'administrative_area_level_7' | 'archipelago' | 'colloquial_area' | 'continent' | 'country' | 'establishment' | 'finance' | 'floor' | 'food' | 'general_contractor' | 'geocode' | 'health' | 'intersection' | 'landmark' | 'locality' | 'natural_feature' | 'neighborhood' | 'place_of_worship' | 'plus_code' | 'point_of_interest' | 'political' | 'post_box' | 'postal_code' | 'postal_code_prefix' | 'postal_code_suffix' | 'postal_town' | 'premise' | 'room' | 'route' | 'street_address' | 'street_number' | 'sublocality' | 'sublocality_level_1' | 'sublocality_level_2' | 'sublocality_level_3' | 'sublocality_level_4' | 'sublocality_level_5' | 'subpremise' | 'town_square'
