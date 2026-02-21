import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useDropzone } from 'react-dropzone'
import { 
  Upload, X, FileText, Bold, Italic, List, 
  ListOrdered, Heading2, Quote, Undo, Redo,
  Plus, Trash2, Save, Send
} from 'lucide-react'
import toast from 'react-hot-toast'
import { planesService } from '../services/planesService'

const YEARS = [
  { value: 1, label: '1er Ano' },
  { value: 2, label: '2do Ano' },
  { value: 3, label: '3er Ano' },
  { value: 4, label: '4to Ano' },
  { value: 5, label: '5to Ano' },
]

export default function CrearPlan() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [temas, setTemas] = useState([])
  const [archivos, setArchivos] = useState([])
  
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    anio_escolar: '',
    tema_id: '',
    duracion_estimada: '',
    objetivos: [''],
    recursos_necesarios: '',
    contenido: ''
  })

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Escribe aqui el contenido de tu plan de clase...'
      })
    ],
    content: formData.contenido,
    onUpdate: ({ editor }) => {
      setFormData(prev => ({ ...prev, contenido: editor.getHTML() }))
    }
  })

  useEffect(() => {
    if (formData.anio_escolar) {
      loadTemas()
    }
  }, [formData.anio_escolar])

  const loadTemas = async () => {
    try {
      const data = await planesService.getTemas(formData.anio_escolar)
      setTemas(data)
    } catch (error) {
      console.error('Error cargando temas:', error)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: (acceptedFiles) => {
      setArchivos(prev => [...prev, ...acceptedFiles])
    },
    onDropRejected: (rejections) => {
      rejections.forEach(({ errors }) => {
        errors.forEach(error => {
          if (error.code === 'file-too-large') {
            toast.error('El archivo es muy grande (max 10MB)')
          } else {
            toast.error('Tipo de archivo no permitido')
          }
        })
      })
    }
  })

  const removeFile = (index) => {
    setArchivos(prev => prev.filter((_, i) => i !== index))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleObjetivoChange = (index, value) => {
    const newObjetivos = [...formData.objetivos]
    newObjetivos[index] = value
    setFormData(prev => ({ ...prev, objetivos: newObjetivos }))
  }

  const addObjetivo = () => {
    setFormData(prev => ({ ...prev, objetivos: [...prev.objetivos, ''] }))
  }

  const removeObjetivo = (index) => {
    if (formData.objetivos.length > 1) {
      setFormData(prev => ({
        ...prev,
        objetivos: prev.objetivos.filter((_, i) => i !== index)
      }))
    }
  }

  const validateStep = (stepNum) => {
    if (stepNum === 1) {
      if (!formData.titulo.trim()) {
        toast.error('El titulo es requerido')
        return false
      }
      if (!formData.anio_escolar) {
        toast.error('Selecciona un ano escolar')
        return false
      }
      if (!formData.tema_id) {
        toast.error('Selecciona un tema')
        return false
      }
    }
    if (stepNum === 2) {
      if (!formData.contenido || formData.contenido === '<p></p>') {
        toast.error('El contenido es requerido')
        return false
      }
    }
    return true
  }

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const handleSubmit = async (estado = 'pendiente') => {
    if (!validateStep(1) || !validateStep(2)) return

    setLoading(true)
    try {
      const planData = {
        ...formData,
        objetivos: formData.objetivos.filter(o => o.trim()),
        estado
      }

      const plan = await planesService.crearPlan(planData)

      // Upload files
      for (const archivo of archivos) {
        await planesService.subirArchivo(plan.id, archivo)
      }

      toast.success(
        estado === 'borrador' 
          ? 'Borrador guardado' 
          : 'Plan enviado para revision'
      )
      navigate(`/plan/${plan.id}`)
    } catch (error) {
      toast.error('Error al crear el plan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
        Crear Plan de Clase
      </h1>
      <p className="text-gray-600 mb-8">
        Comparte tu experiencia con otros docentes de Lengua y Literatura
      </p>

      {/* Progress */}
      <div className="flex items-center mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
              s < step ? 'bg-primary-600 text-white' :
              s === step ? 'bg-primary-600 text-white' :
              'bg-gray-200 text-gray-500'
            }`}>
              {s}
            </div>
            {s < 3 && (
              <div className={`w-20 h-1 ${s < step ? 'bg-primary-600' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Informacion Basica</h2>

          <div>
            <label className="label">Titulo *</label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              className="input"
              placeholder="Ej: Analisis de 'El Aleph' de Borges"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Ano Escolar *</label>
              <select
                name="anio_escolar"
                value={formData.anio_escolar}
                onChange={handleChange}
                className="input"
              >
                <option value="">Seleccionar...</option>
                {YEARS.map(y => (
                  <option key={y.value} value={y.value}>{y.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Tema *</label>
              <select
                name="tema_id"
                value={formData.tema_id}
                onChange={handleChange}
                className="input"
                disabled={!formData.anio_escolar}
              >
                <option value="">Seleccionar...</option>
                {temas.map(t => (
                  <option key={t.id} value={t.id}>{t.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Duracion Estimada</label>
            <input
              type="text"
              name="duracion_estimada"
              value={formData.duracion_estimada}
              onChange={handleChange}
              className="input"
              placeholder="Ej: 2 clases, 1 semana"
            />
          </div>

          <div>
            <label className="label">Descripcion Breve</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={3}
              className="input resize-none"
              placeholder="Breve descripcion del plan de clase..."
            />
          </div>

          <div className="flex justify-end">
            <button onClick={nextStep} className="btn-primary">
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Content */}
      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Contenido del Plan</h2>

          {/* Objectives */}
          <div>
            <label className="label">Objetivos de Aprendizaje</label>
            <div className="space-y-2">
              {formData.objetivos.map((objetivo, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={objetivo}
                    onChange={(e) => handleObjetivoChange(index, e.target.value)}
                    className="input flex-1"
                    placeholder={`Objetivo ${index + 1}`}
                  />
                  {formData.objetivos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeObjetivo(index)}
                      className="btn-ghost text-red-500"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addObjetivo}
                className="btn-ghost text-primary-600 text-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Agregar objetivo
              </button>
            </div>
          </div>

          {/* Rich text editor */}
          <div>
            <label className="label">Contenido de la Clase *</label>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              {/* Toolbar */}
              <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50">
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  className={`p-2 rounded hover:bg-gray-200 ${editor?.isActive('bold') ? 'bg-gray-200' : ''}`}
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  className={`p-2 rounded hover:bg-gray-200 ${editor?.isActive('italic') ? 'bg-gray-200' : ''}`}
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={`p-2 rounded hover:bg-gray-200 ${editor?.isActive('heading') ? 'bg-gray-200' : ''}`}
                >
                  <Heading2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBulletList().run()}
                  className={`p-2 rounded hover:bg-gray-200 ${editor?.isActive('bulletList') ? 'bg-gray-200' : ''}`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                  className={`p-2 rounded hover:bg-gray-200 ${editor?.isActive('orderedList') ? 'bg-gray-200' : ''}`}
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                  className={`p-2 rounded hover:bg-gray-200 ${editor?.isActive('blockquote') ? 'bg-gray-200' : ''}`}
                >
                  <Quote className="w-4 h-4" />
                </button>
                <div className="border-l border-gray-300 mx-1" />
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().undo().run()}
                  className="p-2 rounded hover:bg-gray-200"
                >
                  <Undo className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().redo().run()}
                  className="p-2 rounded hover:bg-gray-200"
                >
                  <Redo className="w-4 h-4" />
                </button>
              </div>
              <EditorContent editor={editor} className="min-h-[300px]" />
            </div>
          </div>

          {/* Resources */}
          <div>
            <label className="label">Recursos Necesarios</label>
            <textarea
              name="recursos_necesarios"
              value={formData.recursos_necesarios}
              onChange={handleChange}
              rows={3}
              className="input resize-none"
              placeholder="Lista los materiales o recursos necesarios..."
            />
          </div>

          <div className="flex justify-between">
            <button onClick={prevStep} className="btn-outline">
              Anterior
            </button>
            <button onClick={nextStep} className="btn-primary">
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Files & Submit */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Archivos y Publicacion</h2>

          {/* File upload */}
          <div>
            <label className="label">Archivos Adjuntos (opcional)</label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">
                Arrastra archivos aqui o <span className="text-primary-600">selecciona</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                PDF, Word, imagenes (max 10MB)
              </p>
            </div>

            {archivos.length > 0 && (
              <div className="mt-4 space-y-2">
                {archivos.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-primary-600 mr-2" />
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold mb-4">Resumen del Plan</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex">
                <dt className="w-32 text-gray-500">Titulo:</dt>
                <dd className="text-gray-900">{formData.titulo}</dd>
              </div>
              <div className="flex">
                <dt className="w-32 text-gray-500">Ano:</dt>
                <dd className="text-gray-900">{formData.anio_escolar}° Ano</dd>
              </div>
              <div className="flex">
                <dt className="w-32 text-gray-500">Tema:</dt>
                <dd className="text-gray-900">
                  {temas.find(t => t.id === formData.tema_id)?.nombre}
                </dd>
              </div>
              <div className="flex">
                <dt className="w-32 text-gray-500">Archivos:</dt>
                <dd className="text-gray-900">{archivos.length} archivo(s)</dd>
              </div>
            </dl>
          </div>

          <div className="flex justify-between">
            <button onClick={prevStep} className="btn-outline">
              Anterior
            </button>
            <div className="flex gap-3">
              <button
                onClick={() => handleSubmit('borrador')}
                disabled={loading}
                className="btn-outline flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Guardar Borrador
              </button>
              <button
                onClick={() => handleSubmit('pendiente')}
                disabled={loading}
                className="btn-primary flex items-center"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Publicar Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
