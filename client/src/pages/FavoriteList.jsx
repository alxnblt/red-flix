import { Box, Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Container from "../components/common/Container"; // Путь к Container
import uiConfigs from "../configs/ui.configs"; // Путь к конфигурациям
import favoriteApi from "../api/modules/favorite.api"; // Путь к api
import { setGlobalLoading } from "../redux/features/globalLoadingSlice"; // Путь к глобальному загрузчику
import FavoriteItem from "../components/common/FavoriteItem"; // Путь к компоненту FavoriteItem

const FavoriteList = () => {
  const [medias, setMedias] = useState([]);
  const [filteredMedias, setFilteredMedias] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  const dispatch = useDispatch();
  const skip = 8;

  useEffect(() => {
    const getFavorites = async () => {
      dispatch(setGlobalLoading(true));
      const { response, err } = await favoriteApi.getList();
      dispatch(setGlobalLoading(false));

      if (err) {
        toast.error(err.message);
        return;
      }

      if (response) {
        setCount(response.length);
        setMedias(response);
        setFilteredMedias(response.slice(0, skip));
      }
    };

    getFavorites();
  }, [dispatch]);

  const onLoadMore = () => {
    setFilteredMedias(prevFiltered => [
      ...prevFiltered,
      ...medias.slice(page * skip, (page + 1) * skip)
    ]);
    setPage(prevPage => prevPage + 1);
  };

  const onRemoved = (id) => {
    const newMedias = medias.filter(media => media.id !== id);
    setMedias(newMedias);
    setFilteredMedias(newMedias.slice(0, page * skip));
    setCount(newMedias.length);
  };

  return (
    <Box sx={{ ...uiConfigs.style.mainContent }}>
      <Container header={`Your favorites (${count})`}>
        <Grid container spacing={1} sx={{ marginRight: "-8px!important" }}>
          {filteredMedias.map((media, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <FavoriteItem media={media} onRemoved={onRemoved} />
            </Grid>
          ))}
        </Grid>
        {filteredMedias.length < medias.length && (
          <Button onClick={onLoadMore}>Load More</Button>
        )}
      </Container>
    </Box>
  );
};

export default FavoriteList;
