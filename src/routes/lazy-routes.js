async function loadHomeRoute() {
  const [{ Home }, { homeLoader }] = await Promise.all([
    import('../pages/Home'),
    import('../loaders/home'),
  ]);

  return {
    Component: Home,
    loader: homeLoader,
  };
}

async function loadMissionRoute() {
  const [{ Missions }, { missionLoader }] = await Promise.all([
    import('../pages/Missions'),
    import('../loaders/mission'),
  ]);

  return {
    Component: Missions,
    loader: missionLoader,
  };
}

async function loadTILRoute() {
  const [{ TIL }, { tilLoader }] = await Promise.all([
    import('../pages/TIL'),
    import('../loaders/til'),
  ]);

  return {
    Component: TIL,
    loader: tilLoader,
  };
}

async function loadTILNewRoute() {
  const { TILNew } = await import('../pages/TILNew');

  return {
    Component: TILNew,
  };
}

async function loadTILDetailRoute() {
  const [{ TILDetail }, { tilDetailLoader }] = await Promise.all([
    import('../pages/TILDetail'),
    import('../loaders/til'),
  ]);

  return {
    Component: TILDetail,
    loader: tilDetailLoader,
  };
}

export {
  loadHomeRoute,
  loadMissionRoute,
  loadTILRoute,
  loadTILNewRoute,
  loadTILDetailRoute,
};
