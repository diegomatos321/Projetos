from trame.app import get_server
from trame.ui.vuetify import SinglePageLayout
from trame.widgets import vtk, vuetify

from vtkmodules.vtkFiltersSources import vtkConeSource
from vtkmodules.vtkRenderingCore import (
    vtkActor,
    vtkPolyDataMapper,
    vtkRenderer,
    vtkRenderWindow,
    vtkRenderWindowInteractor,
)

# Required for interactor initialization
from vtkmodules.vtkInteractionStyle import vtkInteractorStyleSwitch  # noqa

# Required for rendering initialization, not necessary for
# local rendering, but doesn't hurt to include it
import vtkmodules.vtkRenderingOpenGL2  # noqa
from trame.ui.vuetify import VAppLayout

DEFAULT_RESOLUTION = 6

# -----------------------------------------------------------------------------
# VTK pipeline
# -----------------------------------------------------------------------------

renderer = vtkRenderer()
renderWindow = vtkRenderWindow()
renderWindow.AddRenderer(renderer)

renderWindowInteractor = vtkRenderWindowInteractor()
renderWindowInteractor.SetRenderWindow(renderWindow)
renderWindowInteractor.GetInteractorStyle().SetCurrentStyleToTrackballCamera()

cone_source = vtkConeSource()
mapper = vtkPolyDataMapper()
mapper.SetInputConnection(cone_source.GetOutputPort())
actor = vtkActor()
actor.SetMapper(mapper)

renderer.AddActor(actor)
renderer.ResetCamera()

# -----------------------------------------------------------------------------
# Trame
# -----------------------------------------------------------------------------

server = get_server(client_type = "vue2")
ctrl = server.controller
state = server.state

@state.change("resolution")
def update_resolution(resolution, **kwargs):
    cone_source.SetResolution(resolution)
    ctrl.view_update()

def reset_resolution():
    state.resolution = DEFAULT_RESOLUTION

""" with VAppLayout(server) as layout:
    with layout.root:
        with vuetify.VContainer(
            fluid=True,
            classes="pa-0 fill-height"
        ):
            view = vtk.VtkLocalView(renderWindow)
            ctrl.on_server_ready.add(view.update) """

with SinglePageLayout(server) as layout:
    layout.title.set_text("Hello trame")

    with layout.content:
        with vuetify.VContainer(
            fluid=True,
            classes="pa-0 fill-height",
        ):
            view = vtk.VtkLocalView(renderWindow)
            ctrl.on_server_ready.add(view.update)
            ctrl.view_update = view.update
            ctrl.view_reset_camera = view.reset_camera

        with layout.toolbar:
            vuetify.VSpacer()
            vuetify.VSlider(
                v_model=("resolution", DEFAULT_RESOLUTION), # (var_name, initial_value)
                min=3, max=60, step=1,                      # min/max/step
                hide_details=True, dense=True,              # presentation params
                style="max-width: 300px",                   # css style
            )
            with vuetify.VBtn(icon=True, click=reset_resolution):
                vuetify.VIcon("mdi-restore")
            vuetify.VDivider(vertical=True, classes="mx-2")

            vuetify.VSwitch(
                v_model="$vuetify.theme.dark",
                hide_details=True,
                dense=True,
            )
            with vuetify.VBtn(icon=True, click=ctrl.view_reset_camera):
                vuetify.VIcon("mdi-crop-free")
            
# -----------------------------------------------------------------------------
# Main
# -----------------------------------------------------------------------------

if __name__ == "__main__":
    server.start()
