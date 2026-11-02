# Exporta el avatar v8 de tincho.ia (solo tin_rig y sus piezas) a GLB con Draco.
# blender -b contenido-ia/assets/brand/3d/personajes_v2.blend -P tin-export.py -- <salida>/tin.glb
import bpy, sys
out = sys.argv[sys.argv.index("--")+1]
rig = bpy.data.objects["tin_rig"]
bpy.ops.object.select_all(action='DESELECT')
keep = [rig] + list(rig.children_recursive)
for o in keep: o.hide_set(False); o.select_set(True)
bpy.context.view_layer.objects.active = rig
import mathutils
mn=[9e9]*3; mx=[-9e9]*3
for o in keep:
    if o.type=='MESH':
        for c in o.bound_box:
            w=o.matrix_world@mathutils.Vector(c)
            for i in range(3): mn[i]=min(mn[i],w[i]); mx[i]=max(mx[i],w[i])
print("BBOX",mn,mx,"N",len(keep))
print("MATS",sorted({s.material.name for o in keep if o.type=='MESH' for s in o.material_slots if s.material}))
bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', use_selection=True, export_apply=True, export_animations=False, export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=10, export_yup=True)
