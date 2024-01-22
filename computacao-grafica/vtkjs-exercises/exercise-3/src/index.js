import '@kitware/vtk.js/Rendering/Profiles/Geometry';
import '@kitware/vtk.js/IO/Core/DataAccessHelper/HttpDataAccessHelper';

import vtkGenericRenderWindow from '@kitware/vtk.js/Rendering/Misc/GenericRenderWindow';
import vtkVolume from '@kitware/vtk.js/Rendering/Core/Volume';
import vtkVolumeMapper from '@kitware/vtk.js/Rendering/Core/VolumeMapper';
import vtkHttpDataSetReader from '@kitware/vtk.js/IO/Core/HttpDataSetReader';

const container = document.querySelector('#container');

const genericRenderWindow = vtkGenericRenderWindow.newInstance();
genericRenderWindow.setContainer(container);
genericRenderWindow.resize();

const renderer = genericRenderWindow.getRenderer();
const renderWindow = genericRenderWindow.getRenderWindow();

const actor = vtkVolume.newInstance()
const mapper = vtkVolumeMapper.newInstance()

actor.setMapper(mapper)

const reader = vtkHttpDataSetReader.newInstance({ fetchGzip: true });
mapper.setInputConnection(reader.getOutputPort());

reader
  .setUrl('https://kitware.github.io/vtk-js/data/volume/LIDC2.vti')
  .then(() => reader.loadData())
  .then(() => {
    console.log("Foi")
    renderer.addVolume(actor);

    renderer.resetCamera();
    renderWindow.render();
  });
