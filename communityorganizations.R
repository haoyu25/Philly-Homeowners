library(osmdata)
library(sf)
library(dplyr)

# Define the OSM query for multiple community resources
community_sites_osm <- opq(bbox = "Philadelphia") %>%
  add_osm_feature(key = "amenity", 
                  value = c("community_centre", "place_of_worship", "library", "marketplace")) %>%
  osmdata_sf()

community_sites_points <- community_sites_osm$osm_polygons %>%
  st_set_crs(4326) %>%       
  st_make_valid() %>%              
  st_centroid() %>%
  dplyr::filter(`addr:city` == "Philadelphia")

community_sites_points <- community_sites_points[!is.na(community_sites_points$name),] %>%
  dplyr::select(osm_id,name,`addr:housenumber`,`addr:street`,`addr:postcode`,amenity)

st_write(community_sites_points, "community_sites_points.geojson", driver = "GeoJSON")
