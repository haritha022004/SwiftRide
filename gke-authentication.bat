REM ====== Step 4: Setup GCP & GKE credentials ======
set PATH=C:\Users\Sai Nikhil\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin;%PATH%
set USE_GKE_GCLOUD_AUTH_PLUGIN=True
call gcloud auth activate-service-account --key-file="%SERVICE_ACCOUNT_KEY%"
call gcloud container clusters get-credentials %CLUSTER_NAME% --region %CLUSTER_REGION% --project %GCP_PROJECT%
