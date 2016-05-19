import config from "../config.json";

class Avatar {
  format(type, id, avatar_url = null) {
    let _avatar_cache_path = encodeURIComponent(
      avatar_url || "default");

    return (
     `${config.CRISP_IMAGE}/avatar/${type}/` +
      `${id}/200/` +
      `?avatar=${_avatar_cache_path}`
    );
  }
}

export default new Avatar();
