/**
* PackageDetails
**/

'use strict';

import { remote, ipcRenderer, shell } from 'electron';
import React from 'react';
import moment from 'moment';
import Loader from '../../common/Loader';
import PackageActions from './PackageActions';
import PackageTabs from './PackageTabs';
import { showMessageBox, isUrl } from '../../utils';
import { OPTIONS } from '../../constants/Command';
import styles from './PackageDetails.css';

class PackageDetails extends React.Component {
  constructor(props) {
    super(props);
    this._packageGroups = ['dependencies', 'devDependencies', 'optionalDependencies'];
    this._getPackageGroup = this._getPackageGroup.bind(this);
    this.doNavigate = this.doNavigate.bind(this);
    this.doAction = this.doAction.bind(this);
    this.onChangeVersion = this.onChangeVersion.bind(this);
  }
  _getPackageGroup() {
    let packageJSON = this.props.packageJSON;
    let pkg = this.props.active;
    let found = false;
    if(packageJSON && typeof packageJSON === 'object') {
      let name = pkg.name;
      for(let z=0;z<this._packageGroups.length;z++) {
        let group = this._packageGroups[z];
        found = (packageJSON[group] && packageJSON[group][name]) ? group : false;
        if(found) {
          break;
        }
      }
    }

    return found;
  }
  doNavigate(e) {
    e.preventDefault();
    let url = e.target.dataset.url;
    if(isUrl(url)) {
      shell.openExternal(url);
    }
    return false;
  }
  doAction(e) {
    e.preventDefault();
    let target = e.currentTarget;
    let action = target.dataset.action;

    if (action) {
      let mode = this.props.mode;
      let active = this.props.active;
      let selectVersion = this.refs.selectVersion;
      let version, options = this.props.cmdOptions;
      if(action === 'Uninstall') {
        version = null;
      } else {
        version = (selectVersion && selectVersion.value !== "false")
          ? selectVersion.value
          : 'latest';
      }

      showMessageBox({
          action: action,
          name: active.name,
          version: version
        }, () => {
          this.props.setActive(null);
          this.props.toggleMainLoader(true);
          ipcRenderer.send('ipc-event', {
            mode: this.props.mode,
            directory: this.props.directory,
            ipcEvent: action,
            cmd: [(action === 'Uninstall') ? 'uninstall' : 'install'],
            pkgName: active.name,
            pkgVersion: (action === 'Uninstall') ? null : version,
            pkgOptions: options
          });
        });
    }

    return false;
  }
  onChangeVersion(e) {
    let target = e.currentTarget;
    let pkg = this.props.active;
    let version = target.value;

    if (version !== "false") {
      this.props.toggleMainLoader(true);
      ipcRenderer.send('ipc-event', {
        mode: this.props.mode,
        directory: this.props.directory,
        ipcEvent: 'view-package',
        cmd: ['view'],
        pkgName: pkg.name,
        pkgVersion: version
      });
    }
    return false;
  }
  render() {
    let mode = this.props.mode;
    let pkg = this.props.active;
    let group = '';

    if (!pkg) {
      return null;
    }

    if(mode === 'LOCAL') {
      group = this._getPackageGroup();
    }

    return (
      <div className={styles.package__details} ref="rootEl">
        <div className={styles.package__details__head}>
          <div className={styles.package__details__title}>
            <div className={styles.package__details__tag}>
              <i className="fa fa-fw fa-tag"></i>
            </div>
            &nbsp;{pkg.name}&nbsp;
            <span className="label label-success">v{pkg.version}</span>&nbsp;
            {(group && group.length) ? <span className="label label-info">{group}</span> : null}
          </div>
          <div className={styles.package__details__actions}>
            <PackageActions
              group={group}
              mode={this.props.mode}
              directory={this.props.directory}
              active={this.props.active}
              setActive={this.props.setActive}
              toggleMainLoader={this.props.toggleMainLoader}
              doAction={this.doAction}
              packageActions={this.props.packageActions}
              addCommandOption={this.props.addCommandOption}
            />
          </div>
        </div>
        <div className={styles.package__details__info}>
          <div className={styles.package__details__info__top}>
            <div className={styles.package__details__version}>
              <div className="form-group">
                <label htmlFor="selectVersion">
                  <span>Select version</span>
                </label>
                <select value={pkg.version} onChange={this.onChangeVersion} className="form-control input-sm select-mini" ref="selectVersion">
                  <option value="false">-</option>
                  {pkg.versions.map((version, idx) => {
                    return <option key={idx} value={version}>{version}</option>
                  })}
                </select>
              </div>
            </div>
            <div className={styles.package__details__date}>
              Updated:&nbsp; {moment(pkg.time.modified).format('DD/MM/YYYY')}
            </div>
          </div>
        </div>
        <div className={styles.package__details__body}>
          <Loader loading={this.props.isLoading}>
            <PackageTabs pkg={pkg} navigate={this.doNavigate} addOption={this.addOption}/>
          </Loader>
        </div>
      </div>
    )
  }
}

export default PackageDetails;
