import DetailAlbums from "../../../components/photo/DetailAlbums";
export default function Detail_Albums({ sk , idUser , loading , photos , album , user , setVisiblePhoto}) {
  return (
    <DetailAlbums
      sk={sk}
      idUser={idUser}
      loading={loading}
      photos={photos}
      album={album}
      user={user}
      setVisiblePhoto={setVisiblePhoto}
    />
  );
}
