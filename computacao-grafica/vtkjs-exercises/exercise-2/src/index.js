import '@kitware/vtk.js/Rendering/Profiles/Geometry';

import vtkGenericRenderWindow from "@kitware/vtk.js/Rendering/Misc/GenericRenderWindow";
import vtkConeSource from "@kitware/vtk.js/Filters/Sources/ConeSource";
import vtkActor from "@kitware/vtk.js/Rendering/Core/Actor";
import vtkMapper from "@kitware/vtk.js/Rendering/Core/Mapper";
import vtkOutlineFilter from '@kitware/vtk.js/Filters/General/OutlineFilter';

const container = document.querySelector('#container');


const genericRenderWindow = vtkGenericRenderWindow.newInstance();
genericRenderWindow.setContainer(container);
genericRenderWindow.resize();

const renderer = genericRenderWindow.getRenderer();
const renderWindow = genericRenderWindow.getRenderWindow();

const actor = vtkActor.newInstance();
const mapper = vtkMapper.newInstance();
const coneSource = vtkConeSource.newInstance({ height: 1.0 });

mapper.setInputConnection(coneSource.getOutputPort());
actor.setMapper(mapper);
renderer.addActor(actor);

renderer.resetCamera();
// renderWindow.render();

const filter = vtkOutlineFilter.newInstance()
filter.setInputConnection(coneSource.getOutputPort())

const outlineActor = vtkActor.newInstance()
const outlineMapper = vtkMapper.newInstance()
outlineActor.setMapper(outlineMapper)

outlineMapper.setInputConnection(filter.getOutputPort())

renderer.addActor(outlineActor)
renderWindow.render()
