import DeleteIcon from "@mui/icons-material/Delete";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import MediaItem from "./MediaItem"; // Путь к MediaItem, если он находится в той же папке
import favoriteApi from "../../api/modules/favorite.api"; // Путь к api
import { removeFavorite } from "../../redux/features/userSlice"; // Путь к userSlice

const FavoriteItem = ({ media, onRemoved }) => {
  const dispatch = useDispatch();
  const [onRequest, setOnRequest] = useState(false);

  const onRemove = async () => {
    if (onRequest) return;
    setOnRequest(true);
    const { response, err } = await favoriteApi.remove({ favoriteId: media.id });
    setOnRequest(false);

    if (err) {
      toast.error(err.message);
      return;
    }

    toast.success("Remove favorite success");
    dispatch(removeFavorite({ mediaId: media.mediaId }));
    onRemoved(media.id);
  };

  return (
    <>
      <MediaItem media={media} mediaType={media.mediaType} />
      <LoadingButton
        fullWidth
        variant="contained"
        sx={{ marginTop: 2 }}
        startIcon={<DeleteIcon />}
        loadingPosition="start"
        loading={onRequest}
        onClick={onRemove}
      >
        Remove
      </LoadingButton>
    </>
  );
};

export default FavoriteItem;
