# Awesome Heliophysics [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

[![Website](https://img.shields.io/badge/browse-sr--dash.github.io%2Fawesome--heliophysics-E9B44C?logo=githubpages&logoColor=white)](https://sr-dash.github.io/awesome-heliophysics/)
[![Links](https://github.com/sr-dash/awesome-heliophysics/actions/workflows/links.yml/badge.svg)](https://github.com/sr-dash/awesome-heliophysics/actions/workflows/links.yml)
[![Lint](https://github.com/sr-dash/awesome-heliophysics/actions/workflows/lint.yml/badge.svg)](https://github.com/sr-dash/awesome-heliophysics/actions/workflows/lint.yml)
[![Pages](https://github.com/sr-dash/awesome-heliophysics/actions/workflows/pages.yml/badge.svg)](https://github.com/sr-dash/awesome-heliophysics/actions/workflows/pages.yml)
[![License: CC0-1.0](https://img.shields.io/badge/license-CC0--1.0-lightgrey)](LICENSE)

> A curated list of data archives, software, models, viewers and learning resources for the study of the Sun, the heliosphere and space weather.

Heliophysics spans solar physics, the solar wind, planetary magnetospheres and space weather. Its data and tools are spread across many agencies, missions and research groups. This list collects the ones researchers and students use, with a line on what each does.

Browse it with search, section filters and GitHub activity on the website (the badge above links to it).

Missing something? [Suggest a resource](https://github.com/sr-dash/awesome-heliophysics/issues/new?template=suggest-resource.yml) with a short form, or see [contributing](contributing.md).

## Contents

- [Data archives and portals](#data-archives-and-portals)
- [Event catalogues and indices](#event-catalogues-and-indices)
- [Python software](#python-software)
- [IDL and other software](#idl-and-other-software)
- [Data formats and standards](#data-formats-and-standards)
- [Viewers and visualisation](#viewers-and-visualisation)
- [Models and simulation codes](#models-and-simulation-codes)
- [Space-weather services](#space-weather-services)
- [Missions and observatories](#missions-and-observatories)
- [Machine-learning datasets](#machine-learning-datasets)
- [Learning](#learning)
- [Community](#community)

## Data archives and portals

- [AMPERE](https://ampere.jhuapl.edu/) - Field-aligned currents and magnetic perturbations derived from the Iridium satellite constellation.
- [AuroraX](https://aurorax.space/) - Search and browse auroral imager and other ground-based data, with tools to find conjunctions.
- [BASS2000](https://bass2000.obspm.fr/home.php) - French archive of ground-based solar observations, including Meudon spectroheliograms and THEMIS data.
- [CDAWeb](https://cdaweb.gsfc.nasa.gov/) - NASA's multi-mission archive of in situ and ground-based space physics data, with plotting and listing tools.
- [CDPP](https://cdpp.irap.omp.eu/) - French plasma physics data centre for heliospheric, magnetospheric and planetary missions.
- [Cluster Science Archive](https://csa.esac.esa.int/) - ESA's archive of the four-spacecraft Cluster magnetospheric mission.
- [DARTS](https://darts.isas.jaxa.jp/) - JAXA's space science archive, including Hinode, Yohkoh, Geotail and Akebono data.
- [DKIST Data Center](https://dkist.data.nso.edu/) - Search and download of calibrated data from the Daniel K. Inouye Solar Telescope.
- [ESA Heliophysics Archive](https://hpa.esa.int/hpa) - ESA's single archive for the data of its heliophysics missions.
- [GONG data](https://gong.nso.edu/data/) - Full-disk magnetograms, H-alpha, Dopplergrams and synoptic maps from NSO's Global Oscillation Network Group.
- [Helio.Data](https://helio.data.nasa.gov/) - NASA's discovery portal for heliophysics data, catalogues and other digital resources.
- [HelioCloud](https://heliocloud.org/) - Cloud computing platform that keeps heliophysics datasets next to the processing.
- [Heliophysics Data Portal](https://heliophysicsdata.gsfc.nasa.gov/) - Search across NASA heliophysics datasets by time, mission and instrument.
- [Hinode Science Data Centre Europe](https://sdc.uio.no/sdc/) - Hinode SOT, XRT and EIS data, with IRIS mirrors.
- [IBEX data releases](https://ibex.princeton.edu/DataRelease) - Energetic neutral atom maps of the heliosphere's boundary from the Interstellar Boundary Explorer.
- [INTERMAGNET](https://intermagnet.org/) - Real-time and definitive data from ground magnetic observatories around the world.
- [IRIS data](https://iris.lmsal.com/data.html) - Level 2 spectra and slit-jaw images from the Interface Region Imaging Spectrograph.
- [JSOC](http://jsoc.stanford.edu/) - The Joint Science Operations Center archive of SDO HMI and AIA data.
- [Madrigal](https://cedar.openmadrigal.org/) - Upper-atmosphere and ionosphere data from incoherent scatter radars and other ground instruments.
- [MEDOC](https://idoc.osups.universite-paris-saclay.fr/MEDOC/) - European archive of SOHO, STEREO, Solar Orbiter and other solar data.
- [MMS Science Data Center](https://lasp.colorado.edu/mms/sdc/public/) - Data from NASA's four-spacecraft Magnetospheric Multiscale mission.
- [NASA Science Discovery Engine](https://sciencediscoveryengine.nasa.gov/) - Search across NASA science data, software and documents in every discipline.
- [NCEI space weather](https://www.ncei.noaa.gov/products/space-weather) - NOAA's long-term archive of GOES, geomagnetic and ionospheric data.
- [NSSDC (China)](https://www.nssdc.ac.cn/nssdc_en/html/index.html) - China's National Space Science Data Center, with data from Chinese space science missions.
- [NSSDCA](https://nssdc.gsfc.nasa.gov/) - NASA's permanent archive of space science data, with mission and spacecraft descriptions back to the 1950s.
- [OMNIWeb](https://omniweb.gsfc.nasa.gov/) - Near-Earth solar wind, field and index data merged across spacecraft since 1963.
- [Parker Solar Probe Science Gateway](https://psp-gateway.jhuapl.edu/) - Data, orbit information and instrument pages for Parker Solar Probe.
- [PRADAN](https://pradan.issdc.gov.in/al1/) - ISRO's archive of Aditya-L1 data.
- [SDAC](https://umbra.nascom.nasa.gov/) - NASA's Solar Data Analysis Center, with SOHO and other solar mission data and tools.
- [Solar Orbiter Archive](https://soar.esac.esa.int/soar/) - ESA's archive of Solar Orbiter remote-sensing and in situ data.
- [SSCWeb](https://sscweb.gsfc.nasa.gov/) - Spacecraft orbit locations and conjunctions in many coordinate systems, with web services.
- [STEREO Science Center](https://stereo-ssc.nascom.nasa.gov/) - STEREO data, browse images, orbit plots and mission status.
- [STIX Data Center](https://datacenter.stix.i4ds.net/) - Solar Orbiter STIX X-ray light curves, flare lists and data.
- [SuperDARN](https://superdarn.jhuapl.edu/) - Data and plots from the international network of high-frequency radars that map ionospheric convection.
- [SuperMAG](https://supermag.jhuapl.edu/) - Ground magnetometer data from hundreds of stations, processed in one way.
- [SWx TREC Space Weather Data Portal](https://lasp.colorado.edu/space-weather-portal/home) - Interactive plots of space-weather data from many sources in one place.
- [THEMIS data](https://themis.ssl.berkeley.edu/overview_data.shtml) - Data and summary plots from the THEMIS and ARTEMIS missions and their ground magnetometers and all-sky cameras.
- [VESPA](https://vespa.obspm.fr/) - Virtual observatory for planetary and heliophysics data, searchable through the EPN-TAP protocol.
- [Virtual Solar Observatory](https://sdac.virtualsolar.org/) - One search interface over many solar data archives.

## Event catalogues and indices

- [CDAW LASCO CME catalogue](https://cdaw.gsfc.nasa.gov/CME_list/) - Every CME seen by SOHO LASCO since 1996, with speeds, widths and movies.
- [DONKI](https://ccmc.gsfc.nasa.gov/tools/DONKI/) - NASA's database of flares, CMEs, solar energetic particle events and geomagnetic storms.
- [GFZ Kp index](https://kp.gfz.de/en/) - The official Kp, ap and Hpo geomagnetic indices.
- [HELCATS](https://www.helcats-fp7.eu/) - Catalogues of coronal mass ejections and solar wind structures tracked in the STEREO heliospheric imagers.
- [Heliophysics Event Knowledgebase](https://www.lmsal.com/hek/) - Searchable catalogue of solar features and events detected in SDO and other data.
- [Multi-spacecraft bow shock database](https://omniweb.gsfc.nasa.gov/ftpbrowser/bowshock.html) - Crossings of Earth's bow shock by many spacecraft, with the plasma and field conditions at each.
- [Multi-spacecraft magnetopause database](https://omniweb.gsfc.nasa.gov/ftpbrowser/magnetopause.html) - Magnetopause crossings by many spacecraft, with the upstream solar wind conditions.
- [SILSO](https://www.sidc.be/SILSO/) - The international sunspot number and its history since 1700.
- [WDC for Geomagnetism, Kyoto](https://wdc.kugi.kyoto-u.ac.jp/) - Dst, AE and other geomagnetic indices.

## Python software

- [aiapy](https://github.com/LM-SAL/aiapy) - Calibration and analysis of SDO AIA data.
- [cdflib](https://github.com/lasp/cdflib) - Read and write NASA CDF files in pure Python.
- [ChiantiPy](https://github.com/chianti-atomic/ChiantiPy) - Python interface to the CHIANTI atomic database for optically thin emission.
- [dkist](https://github.com/DKISTDC/dkist) - Search, transfer and work with DKIST datasets.
- [drms](https://github.com/sunpy/drms) - Query and export data from JSOC.
- [eispac](https://github.com/USNavalResearchLaboratory/eispac) - Hinode EIS data analysis, including line fitting.
- [fiasco](https://github.com/wtbarnes/fiasco) - Atomic data and emission calculations from CHIANTI with units.
- [hapiclient](https://github.com/hapi-server/client-python) - Client for data servers that use the Heliophysics API (HAPI).
- [hdpws](https://pypi.org/project/hdpws/) - Client for the Heliophysics Data Portal web services.
- [heliofleet-mcp](https://github.com/sr-dash/heliofleet-mcp) - Spacecraft positions, alignments, viewing geometry and solar observation records as JSON, from a command line, Python or an MCP server.
- [irispy](https://github.com/LM-SAL/irispy) - Read and analyse IRIS spectra and slit-jaw images.
- [Kamodo](https://github.com/nasa/Kamodo) - Uniform access to space-weather model output and data as functions.
- [ndcube](https://github.com/sunpy/ndcube) - N-dimensional data with world coordinates, the basis of many solar data objects.
- [PlasmaPy](https://github.com/PlasmaPy/PlasmaPy) - Plasma physics formulary, diagnostics and simulation helpers.
- [PsiPy](https://github.com/predsci/PsiPy) - Read and plot output of Predictive Science's MAS and POT3D models.
- [pycelp](https://github.com/tschad/pycelp) - Forward modelling of coronal emission-line polarisation.
- [pysat](https://github.com/pysat/pysat) - Common interface to space science instrument data, mainly ionospheric and magnetospheric.
- [pySPEDAS](https://github.com/spedas/pyspedas) - Load, process and plot data from dozens of space physics missions.
- [radiospectra](https://github.com/sunpy/radiospectra) - Solar radio spectrograms from e-Callisto, STEREO WAVES and other instruments.
- [SEPpy](https://github.com/serpentine-h2020/SEPpy) - Load and analyse solar energetic particle data from several missions.
- [solarmach](https://github.com/jgieseler/solarmach) - Plot spacecraft positions and their Parker-spiral magnetic connection to the Sun.
- [SpacePy](https://github.com/spacepy/spacepy) - Tools for space science: coordinates, time, empirical models and data handling.
- [Speasy](https://github.com/SciQLop/speasy) - One interface to CDAWeb, AMDA, CSA and other space physics web services.
- [stixpy](https://github.com/TCDSolar/stixpy) - Solar Orbiter STIX data search, loading and imaging.
- [sunkit-image](https://github.com/sunpy/sunkit-image) - Image processing for solar data: enhancement, tracking and coalignment.
- [sunkit-magex](https://github.com/sunpy/sunkit-magex) - Potential-field source-surface (PFSS) extrapolation and field-line tracing.
- [SunPy](https://github.com/sunpy/sunpy) - The core Python package for solar physics: maps, coordinates, time series and data search, including the Solar Orbiter Archive.
- [sunraster](https://github.com/sunpy/sunraster) - Spectral and raster-scan data such as IRIS and EIS.
- [VirES client](https://github.com/ESA-VirES/VirES-Python-Client) - Access Swarm and other geomagnetic data and models.
- [xrtpy](https://github.com/HinodeXRT/xrtpy) - Hinode XRT temperature response and analysis.

## IDL and other software

- [AMDA](https://amda.irap.omp.eu/) - Web workspace for plotting and analysing space physics time series.
- [Autoplot](https://autoplot.org/) - Interactive browser and plotter for time-series data in CDF, HAPI and other formats.
- [CHIANTI](https://www.chiantidatabase.org/) - Atomic database and software for the emission of astrophysical plasmas.
- [SciQLop](https://github.com/SciQLop/SciQLop) - Desktop application for exploring and labelling in situ space physics data.
- [SolarSoft](https://www.lmsal.com/solarsoft/) - The IDL library behind most solar mission pipelines and analysis software.
- [SPEDAS](https://spedas.org/) - IDL framework for loading and analysing multi-mission space physics data.

## Data formats and standards

- [CDF](https://cdf.gsfc.nasa.gov/) - The Common Data Format and its libraries, used for most in situ space physics data.
- [FITS](https://fits.gsfc.nasa.gov/) - The standard file format for solar and astronomical images, with its documentation and software.
- [HAPI](https://hapi-server.org/) - A common interface for serving and reading time-series data, with a list of servers that use it.
- [HDF5](https://www.hdfgroup.org/solutions/hdf5/) - Hierarchical file format and library for large scientific datasets.
- [ISTP metadata guidelines](https://spdf.gsfc.nasa.gov/sp_use_of_cdf.html) - Conventions for the metadata inside space physics CDF files.
- [netCDF](https://www.unidata.ucar.edu/software/netcdf/) - Self-describing array format and libraries, common for model output.
- [SPASE](https://spase-group.org/) - Metadata standard for describing heliophysics data products, instruments and observatories.

## Viewers and visualisation

- [3DView](http://3dview.irap.omp.eu/) - 3D view of spacecraft positions, orbits and fields of view in the heliosphere.
- [4D Orbit Viewer](https://sscweb.gsfc.nasa.gov/tipsod/) - Interactive 3D view of spacecraft orbits around Earth over time.
- [Eyes on the Solar System](https://eyes.nasa.gov/apps/solar-system/) - NASA's 3D browser view of planets and spacecraft.
- [HelioField](https://sr-dash.github.io/heliofield/) - Daily 3D PFSS coronal field with spacecraft magnetic connectivity and a space-weather outlook.
- [HelioFleet](https://sr-dash.github.io/heliofleet/) - Map of heliophysics spacecraft positions with alignments, viewing geometry and observation footprints.
- [Helioviewer.org](https://helioviewer.org/) - Browse and combine solar images from many missions in the browser.
- [iSWA](https://ccmc.gsfc.nasa.gov/tools/ISWA/) - CCMC's configurable dashboard of space-weather data and model output.
- [JHelioviewer](https://www.jhelioviewer.org/) - Desktop viewer for solar images and movies from many missions, with 3D views.
- [Scientific Visualization Studio](https://svs.gsfc.nasa.gov/) - NASA's library of scientific visualisations and animations, many of the Sun and the heliosphere.
- [SolarMonitor](https://www.solarmonitor.org/) - Daily summary of active regions, flare probabilities and full-disk images.

## Models and simulation codes

- [Athena++](https://github.com/PrincetonUniversity/athena) - Adaptive-mesh MHD code used for solar and astrophysical plasmas.
- [CCMC](https://ccmc.gsfc.nasa.gov/) - NASA's Community Coordinated Modeling Center: runs on request of coronal, heliospheric and magnetospheric models.
- [Lare3d](https://github.com/Warwick-Plasma/Lare3d) - Lagrangian-remap MHD code for the solar atmosphere.
- [Lightweaver](https://github.com/Goobley/Lightweaver) - Framework for non-LTE radiative transfer.
- [MPI-AMRVAC](https://amrvac.org/) - Parallel adaptive-mesh code for (magneto)hydrodynamics, widely used for solar applications.
- [POT3D](https://github.com/predsci/POT3D) - Fast potential-field solver for the solar corona.
- [RH 1.5D](https://github.com/ITA-Solar/rh) - Massively parallel non-LTE radiative transfer for solar spectral lines.
- [SWMF](https://github.com/SWMFsoftware/SWMF) - The Space Weather Modeling Framework, coupling models from the Sun to the ionosphere.

## Space-weather services

- [ESA Space Weather Service Network](https://swe.ssa.esa.int/) - ESA's space-weather products and expert service centres.
- [Met Office space weather](https://weather.metoffice.gov.uk/specialist-forecasts/space-weather) - The UK's operational space-weather forecast.
- [NICT space weather forecast](https://swc.nict.go.jp/en/) - Japan's space-weather forecast and alerts.
- [NOAA SWPC](https://www.spaceweather.gov/) - The official US forecasts, alerts and real-time solar wind.
- [SIDC](https://www.sidc.be/) - The Solar Influences Data Analysis Center in Brussels: forecasts, alerts and the sunspot number.
- [Space Weather Canada](https://www.spaceweather.gc.ca/) - Canada's space-weather forecasts, with magnetometer and riometer data.
- [SWS Australia](https://www.sws.bom.gov.au/) - Australia's space-weather forecasts and data.

## Missions and observatories

- [Aditya-L1](https://www.isro.gov.in/Aditya_L1.html) - India's solar observatory at L1.
- [Advanced Composition Explorer](https://izw1.caltech.edu/ACE/) - Solar wind and energetic particle monitor at L1 since 1997.
- [DKIST](https://nso.edu/telescopes/inouye-solar-telescope/) - The 4 m Daniel K. Inouye Solar Telescope on Haleakalā.
- [GONG](https://gong.nso.edu/) - NSO's six-station network observing the full Sun around the clock.
- [Hinode](https://hinode.nao.ac.jp/en/) - JAXA-led solar mission with optical, X-ray and EUV instruments.
- [IMAP](https://science.nasa.gov/mission/imap/) - NASA's Interstellar Mapping and Acceleration Probe at L1.
- [IRIS](https://iris.lmsal.com/) - NASA's Interface Region Imaging Spectrograph.
- [Parker Solar Probe](https://parkersolarprobe.jhuapl.edu/) - The first spacecraft to fly through the solar corona.
- [PROBA2](https://proba2.sidc.be/) - ESA microsatellite with the SWAP EUV imager and LYRA radiometer.
- [PUNCH](https://punch.space.swri.edu/) - NASA mission imaging the corona as it becomes the solar wind.
- [SOHO](https://soho.nascom.nasa.gov/) - ESA and NASA's Solar and Heliospheric Observatory at L1 since 1995.
- [Solar Dynamics Observatory](https://sdo.gsfc.nasa.gov/) - NASA's full-disk imaging and magnetic-field observatory.
- [Solar Orbiter](https://www.cosmos.esa.int/web/solar-orbiter) - ESA and NASA's mission to image the Sun's poles and connect the corona to the solar wind.
- [STEREO](https://science.nasa.gov/mission/stereo/) - Twin spacecraft that gave the first stereoscopic views of the Sun.
- [Wind](https://wind.nasa.gov/) - Solar wind monitor near Earth since 1994.

## Machine-learning datasets

- [SDOBenchmark](https://github.com/i4Ds/SDOBenchmark) - Flare-prediction benchmark of SDO image cut-outs.
- [SDOML](https://registry.opendata.aws/sdoml-fdl/) - Machine-learning-ready SDO AIA, HMI and EVE data on AWS.
- [SWAN-SF](https://doi.org/10.7910/DVN/EBCFKM) - Multivariate time series of active-region parameters for flare forecasting.

## Learning

- [ADS](https://ui.adsabs.harvard.edu/) - The NASA Astrophysics Data System, the main search engine for the heliophysics and astronomy literature.
- [Heliophysics Summer School](https://heliophysics.ucar.edu/summer-school) - Annual school on heliophysics as one science, with lectures online.
- [INSPIRE](https://theinspireproject.org/) - Build a very-low-frequency receiver and record natural radio emissions from the magnetosphere.
- [Living Reviews in Solar Physics](https://link.springer.com/journal/41116) - Open-access review articles on every area of solar physics.
- [Perspectives on Plasmas](https://www.plasmas.org/) - Introduction to plasma science for students and the public.
- [Radio JOVE](https://radiojove.gsfc.nasa.gov/) - Build a simple radio telescope and observe radio bursts from the Sun and Jupiter.
- [SunPy tutorial](https://docs.sunpy.org/en/stable/tutorial/index.html) - Step-by-step introduction to solar data analysis in Python.
- [UCLA Space Physics Exercises](https://spacephysics.ucla.edu/) - Introductory modules on space physics topics, with exercises.

## Community

- [AGU Space Physics and Aeronomy](https://connect.agu.org/spa/home) - The American Geophysical Union's section for space physics and aeronomy.
- [Center for HelioAnalytics](https://www.helioanalytics.io/) - NASA Goddard's centre for machine learning and data science in heliophysics, with tutorials and events.
- [ESA Heliophysics](https://www.cosmos.esa.int/web/esa-heliophysics) - ESA's heliophysics missions, archives and community pages in one place.
- [Helionauts](https://helionauts.org/) - Discussion forum for the heliophysics community.
- [IHDEA](https://ihdea.net/) - International Heliophysics Data Environment Alliance, coordinating data standards and services among agencies.
- [ISWAT](https://www.iswat-cospar.org/) - COSPAR's International Space Weather Action Teams, organised by topic from the Sun to Earth.
- [Python in Heliophysics Community](https://heliopython.org/) - Coordinates Python packages across heliophysics and keeps their standards.
- [SCOSTEP PRESTO](https://scostep.org/presto/presto-science-program/) - SCOSTEP's science programme on the predictability of the variable solar-terrestrial coupling.
- [SHINE](https://helioshine.org/) - Solar, Heliospheric and INterplanetary Environment workshop series.
- [Solar Physics Division](https://spd.aas.org/) - The American Astronomical Society's division for solar physics.
- [WHPI](https://whpi.hao.ucar.edu/) - Whole Heliosphere and Planetary Interactions, coordinated observing campaigns around solar minimum.
