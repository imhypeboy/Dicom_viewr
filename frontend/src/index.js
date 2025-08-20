import {Enums, init as coreInit, RenderingEngine} from '@cornerstonejs/core';
import { init as dicomImageLoaderInit } from '@cornerstonejs/dicom-image-loader';
import { init, Enums as toolsEnums, ToolGroupManager } from '@cornerstonejs/tools';
import * as csTools3d from '@cornerstonejs/tools';
const { PanTool, ZoomTool, StackScrollTool, WindowLevelTool } = csTools3d;

async function initCornerstone() {
    await coreInit();
    await dicomImageLoaderInit();
    await init();
}

await initCornerstone();

window.addEventListener("load", () => {
    const content = document.getElementById('content');
    const element = document.createElement('div');

    element.style.width = '500px';
    element.style.height = '500px';
    element.style.backgroundColor = 'purple';

    content.appendChild(element);

    const input = document.getElementById('file');
    input.addEventListener("change", (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            const data = reader.result;
            render(data, element);
        }
        reader.readAsArrayBuffer(file);
    });

});

function render(arrayBuffer, element) {
    // Create ImageId
    const url = URL.createObjectURL(new Blob([arrayBuffer]), {type: "application/dicom"});
    const imageId = `dicomweb:${url}`;
    console.log('imageId : ', imageId);

    // Get Cornerstone imageIds and fetch metadata into RAM
    const imageIds = [imageId];

    const renderingEngineId = 'myRenderingEngine';
    const renderingEngine = new RenderingEngine(renderingEngineId);

    const viewportId = 'CT_AXIAL_STACK';

    const viewportInput = {
        viewportId,
        element,
        type: Enums.ViewportType.STACK,
    };

    renderingEngine.enableElement(viewportInput);

    const viewport = renderingEngine.getViewport(viewportId);
    viewport.setStack(imageIds, 0);

    // 사용할 툴 등록
    csTools3d.addTool(PanTool);
    csTools3d.addTool(ZoomTool);
    csTools3d.addTool(StackScrollTool);
    csTools3d.addTool(WindowLevelTool);

    // 뷰 포트에 연결할 그룹 생성
    const toolGroupId = 'ctToolGroup';
    const ctToolGroup = ToolGroupManager.createToolGroup(toolGroupId);

    // Add tools to ToolGroup
    // Manipulation tools
    ctToolGroup.addTool(PanTool.toolName);
    ctToolGroup.addTool(ZoomTool.toolName);
    ctToolGroup.addTool(StackScrollTool.toolName);
    ctToolGroup.addTool(WindowLevelTool.toolName);

    // 생성한 툴 그룹에 1:1로 뷰포트 연결
    // Apply tool group to viewport or all viewports rendering a scene
    ctToolGroup.addViewport(viewportId, renderingEngineId);

    // 툴 활성화
    // Set the ToolGroup's ToolMode for each tool
    // Possible modes include: 'Active', 'Passive', 'Enabled', 'Disabled'
    ctToolGroup.setToolActive(WindowLevelTool.toolName, {
        bindings: [{ mouseButton: toolsEnums.MouseBindings.Primary }],
    });
    ctToolGroup.setToolActive(PanTool.toolName, {
        bindings: [{ mouseButton: toolsEnums.MouseBindings.Primary,
            modifierKey: toolsEnums.KeyboardBindings.Ctrl
        }],
    });
    ctToolGroup.setToolActive(ZoomTool.toolName, {
        bindings: [{ mouseButton: toolsEnums.MouseBindings.Secondary }],
    });
    ctToolGroup.setToolActive(StackScrollTool.toolName);

    viewport.render();
}