import DetailAlbumsGroup from "../../../components/media/DetailAlbumsGroup";
export default function Detail_Albums_Group({ sk , idUser , loading , photos , album ,setVisiblePhoto }) {
  return (
    <DetailAlbumsGroup
      sk={sk}
      idUser={idUser}
      loading={loading}
      photos={photos}
      album={album}
      setVisiblePhoto={setVisiblePhoto}
    />
  );
}
