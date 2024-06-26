/*=========================================================================

  Copyright (c) Ken Martin, Will Schroeder, Bill Lorensen
  All rights reserved.
  See Copyright.txt or http://www.kitware.com/Copyright.htm for details.

	 This software is distributed WITHOUT ANY WARRANTY; without even
	 the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
	 PURPOSE.  See the above copyright notice for more information.

=========================================================================*/

// First include the required header files for the VTK classes we are using.
#include <vtkActor.h>
#include <vtkCamera.h>
#include <vtkCommand.h>
#include <vtkConeSource.h>
#include <vtkNamedColors.h>
#include <vtkNew.h>
#include <vtkPolyDataMapper.h>
#include <vtkProperty.h>
#include <vtkRenderer.h>
#include <vtkRenderWindow.h>
#include <vtkRenderWindowInteractor.h>
#include <vtkInteractorStyleTrackballCamera.h>
#include <vtkBoxWidget.h>
#include <vtkTransform.h>

#include <iostream>

//
// We put the callback in an anonymous namespace, i.e. a namespace with
// no name. This anonymous namespace is only accessible within the file
// that you have created it in. So it is a good way of declaring unique
// identifiers and avoiding making global static variables.
//
namespace
{
	// Callback for the interaction.
	class vtkMyCallback : public vtkCommand
	{
	public:
		static vtkMyCallback *New()
		{
			return new vtkMyCallback;
		}
		void Execute(vtkObject *caller, unsigned long, void *) override
		{
			vtkNew<vtkTransform> t;
			auto widget = reinterpret_cast<vtkBoxWidget *>(caller);
			widget->GetTransform(t);
			widget->GetProp3D()->SetUserTransform(t);
		}
		vtkMyCallback() = default;
	};
} // namespace

int main(int, char *[])
{
	//
	// Next we create an instance of vtkNamedColors and we will use
	// this to select colors for the object and background.
	//
	vtkNew<vtkNamedColors> colors;

	//
	// Now we create an instance of vtkConeSource and set some of its
	// properties. The instance of vtkConeSource "cone" is part of a
	// visualization pipeline (it is a source process object); it produces data
	// (output type is vtkPolyData) which other filters may process.
	//
	vtkNew<vtkConeSource> cone;
	cone->SetHeight(3.0);
	cone->SetRadius(1.0);
	cone->SetResolution(10);

	//
	// In this example we terminate the pipeline with a mapper process object.
	// (Intermediate filters such as vtkShrinkPolyData could be inserted in
	// between the source and the mapper.)  We create an instance of
	// vtkPolyDataMapper to map the polygonal data into graphics primitives. We
	// connect the output of the cone source to the input of this mapper.
	//
	vtkNew<vtkPolyDataMapper> coneMapper;
	coneMapper->SetInputConnection(cone->GetOutputPort());

	//
	// Create an actor to represent the cone. The actor orchestrates rendering
	// of the mapper's graphics primitives. An actor also refers to properties
	// via a vtkProperty instance, and includes an internal transformation
	// matrix. We set this actor's mapper to be coneMapper which we created
	// above.
	//
	vtkNew<vtkActor> coneActor;
	coneActor->SetMapper(coneMapper);
	// coneActor->GetProperty()->SetColor(colors->GetColor3d("MistyRose").GetData());
	coneActor->GetProperty()->SetColor(colors->GetColor3d("Bisque").GetData());
	// coneActor->GetProperty()->SetColor(0.2, 0.63, 0.79);
	// coneActor->GetProperty()->SetDiffuse(0.7);
	// coneActor->GetProperty()->SetSpecular(0.4);
	// coneActor->GetProperty()->SetSpecularPower(20);

	//
	// Create a property and directly manipulate it. Assign it to the
	// second actor.
	//
	// vtkNew<vtkProperty> property;
	// property->SetColor(colors->GetColor3d("Tomato").GetData());
	// property->SetDiffuse(0.7);
	// property->SetSpecular(0.4);
	// property->SetSpecularPower(20);

	//
	// Create a second actor and a property. The property is directly
	// manipulated and then assigned to the actor. In this way, a single
	// property can be shared among many actors. Note also that we use the
	// same mapper as the first actor did. This way we avoid duplicating
	// geometry, which may save lots of memory if the geometry is large.
	// vtkNew<vtkActor> coneActor2;
	// coneActor2->SetMapper(coneMapper);
	// coneActor2->GetProperty()->SetColor(colors->GetColor3d("LightSeaGreen").GetData());
	// coneActor2->SetProperty(property);
	// coneActor2->SetPosition(0, 2, 0);

	//
	// Create two renderers and assign actors to them. A renderer renders into
	// a viewport within the vtkRenderWindow. It is part or all of a window on
	// the screen and it is responsible for drawing the actors it has.  We also
	// set the background color here. In this example we are adding the same
	// actor to two different renderers; it is okay to add different actors to
	// different renderers as well.
	//
	vtkNew<vtkRenderer> ren1;
	ren1->AddActor(coneActor);
	// ren1->AddActor(coneActor2);
	ren1->SetBackground(colors->GetColor3d("MidnightBlue").GetData());
	// ren1->SetViewport(0.0, 0.0, 0.5, 1.0);

	// vtkNew<vtkRenderer> ren2;
	// ren2->AddActor(coneActor);
	// ren2->SetBackground(colors->GetColor3d("MidnightBlue").GetData());
	// ren2->SetViewport(0.5, 0.0, 1.0, 1.0);

	// Finally we create the render window which will show up on the screen.
	// We put our renderer into the render window using AddRenderer. We also
	// set the size to be 600 pixels by 300.
	//
	vtkNew<vtkRenderWindow> renWin;
	renWin->AddRenderer(ren1);
	// renWin->AddRenderer(ren2);
	renWin->SetSize(300, 300);
	renWin->SetWindowName("Tutorial_Step6");

	//
	// Make one view 90 degrees from other.
	//
	ren1->ResetCamera();
	ren1->GetActiveCamera()->Azimuth(-90);

	//
	// Now we loop over 360 degrees and render the cone each time.
	//
	/*  for (int i = 0; i < 360; ++i)
	 {
	   // Render the image
	   renWin->Render();
	   Rotate the active camera by one degree.
	   ren1->GetActiveCamera()->Azimuth(1);
	   coneActor->RotateY(1.0);
	 } */

	//
	// The vtkRenderWindowInteractor class watches for events (e.g., keypress,
	// mouse) in the vtkRenderWindow. These events are translated into
	// event invocations that VTK understands (see VTK/Common/vtkCommand.h
	// for all events that VTK processes). Then observers of these VTK
	// events can process them as appropriate.
	vtkNew<vtkRenderWindowInteractor> renWinInt;
	renWinInt->SetRenderWindow(renWin);

	//
	// By default the vtkRenderWindowInteractor instantiates an instance
	// of vtkInteractorStyle. vtkInteractorStyle translates a set of events
	// it observes into operations on the camera, actors, and/or properties
	// in the vtkRenderWindow associated with the vtkRenderWinodwInteractor.
	// Here we specify a particular interactor style.
	vtkNew<vtkInteractorStyleTrackballCamera> style;
	renWinInt->SetInteractorStyle(style);

	//
	// Here we use a vtkBoxWidget to transform the underlying coneActor (by
	// manipulating its transformation matrix). Many other types of widgets
	// are available for use, see the documentation for more details.
	//
	// The SetInteractor method is how 3D widgets are associated with the render
	// window interactor. Internally, SetInteractor sets up a bunch of callbacks
	// using the Command/Observer mechanism (AddObserver()). The place factor
	// controls the initial size of the widget with respect to the bounding box
	// of the input to the widget.
	vtkNew<vtkBoxWidget> boxWidget;
	boxWidget->SetInteractor(renWinInt);
	boxWidget->SetPlaceFactor(1.25);
	boxWidget->GetOutlineProperty()->SetColor(colors->GetColor3d("Gold").GetData());

	//
	// Place the interactor initially. The input to a 3D widget is used to
	// initially position and scale the widget. The EndInteractionEvent is
	// observed which invokes the SelectPolygons callback.
	//
	boxWidget->SetProp3D(coneActor);
	boxWidget->PlaceWidget();
	vtkNew<vtkMyCallback> callback;
	boxWidget->AddObserver(vtkCommand::InteractionEvent, callback);

	//	
	// Normally the user presses the "i" key to bring a 3D widget to life. Here
	// we will manually enable it so it appears with the cone.
	//
	// boxWidget->On();

	//
	// Unlike the previous scripts where we performed some operations and then
	// exited, here we leave an event loop running. The user can use the mouse
	// and keyboard to perform the operations on the scene according to the
	// current interaction style. When the user presses the "e" key, by default
	// an ExitEvent is invoked by the vtkRenderWindowInteractor which is caught
	// and drops out of the event loop (triggered by the Start() method that
	// follows.
	//
	ren1->ResetCamera();
	renWinInt->Initialize();
	renWinInt->Start();

	return EXIT_SUCCESS;
}
